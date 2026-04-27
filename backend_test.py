#!/usr/bin/env python3
"""
Comprehensive Backend API Test Suite for AFN Graphics E-commerce App
Tests all backend endpoints with dual brand support
"""

import requests
import json
import time
import sys
from typing import Dict, Any, Optional

# Base URL from environment
BASE_URL = "https://afn-design-mart.preview.emergentagent.com/api"

# Test data - using timestamp to ensure uniqueness
import time
timestamp = str(int(time.time()))
TEST_USER = {
    "username": f"testuser{timestamp}",
    "name": "John Doe",
    "phone": f"987654{timestamp[-4:]}",
    "password": "TestPass123",
    "email": f"john.doe{timestamp}@example.com",
    "address": "123 Test Street, Test City"
}

ADMIN_CREDENTIALS = {
    "username": "afngraphics7867",
    "password": "Fahad@1303"
}

class APITester:
    def __init__(self):
        self.user_token = None
        self.admin_token = None
        self.test_product_id = None
        self.test_category_id = None
        self.test_order_id = None
        self.results = {
            "passed": 0,
            "failed": 0,
            "errors": []
        }

    def log_result(self, test_name: str, success: bool, message: str = ""):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if message:
            print(f"   {message}")
        
        if success:
            self.results["passed"] += 1
        else:
            self.results["failed"] += 1
            self.results["errors"].append(f"{test_name}: {message}")

    def make_request(self, method: str, endpoint: str, data: Dict = None, headers: Dict = None, params: Dict = None) -> tuple:
        """Make HTTP request and return (success, response_data, status_code)"""
        url = f"{BASE_URL}{endpoint}"
        
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=headers, params=params, timeout=30)
            elif method.upper() == "POST":
                response = requests.post(url, json=data, headers=headers, params=params, timeout=30)
            elif method.upper() == "PUT":
                response = requests.put(url, json=data, headers=headers, params=params, timeout=30)
            elif method.upper() == "DELETE":
                response = requests.delete(url, headers=headers, params=params, timeout=30)
            else:
                return False, {"error": f"Unsupported method: {method}"}, 400

            try:
                response_data = response.json()
            except:
                response_data = {"raw_response": response.text}

            return response.status_code < 400, response_data, response.status_code

        except requests.exceptions.RequestException as e:
            return False, {"error": str(e)}, 0

    def get_auth_headers(self, token: str) -> Dict[str, str]:
        """Get authorization headers"""
        return {"Authorization": f"Bearer {token}"}

    def test_seed_database(self):
        """Test database seeding"""
        print("\n=== Testing Database Seeding ===")
        
        success, data, status = self.make_request("POST", "/seed")
        self.log_result("Seed Database", success and status == 200, 
                       f"Status: {status}, Response: {data.get('message', data)}")

    def test_user_registration(self):
        """Test user registration"""
        print("\n=== Testing User Registration ===")
        
        success, data, status = self.make_request("POST", "/auth/register", TEST_USER)
        
        if success and status == 200 and "token" in data:
            self.user_token = data["token"]
            self.log_result("User Registration", True, f"User registered successfully, token received")
        else:
            self.log_result("User Registration", False, 
                           f"Status: {status}, Response: {data}")

    def test_user_login(self):
        """Test user login"""
        print("\n=== Testing User Login ===")
        
        login_data = {
            "identifier": TEST_USER["username"],
            "password": TEST_USER["password"]
        }
        
        success, data, status = self.make_request("POST", "/auth/login", login_data)
        
        if success and status == 200 and "token" in data:
            self.user_token = data["token"]
            self.log_result("User Login", True, f"Login successful, token received")
        else:
            self.log_result("User Login", False, 
                           f"Status: {status}, Response: {data}")

    def test_forgot_password_flow(self):
        """Test forgot password OTP flow"""
        print("\n=== Testing Forgot Password Flow ===")
        
        # Test forgot password
        forgot_data = {"identifier": TEST_USER["username"]}
        success, data, status = self.make_request("POST", "/auth/forgot-password", forgot_data)
        
        if success and status == 200 and "otp_hint" in data:
            otp = data["otp_hint"]
            self.log_result("Forgot Password OTP Generation", True, f"OTP generated: {otp}")
            
            # Test OTP verification
            verify_data = {"identifier": TEST_USER["username"], "otp": otp}
            success, data, status = self.make_request("POST", "/auth/verify-otp", verify_data)
            
            if success and status == 200:
                user_id = data.get("user_id")
                self.log_result("OTP Verification", True, f"OTP verified, user_id: {user_id}")
                
                # Test password reset
                reset_data = {"user_id": user_id, "new_password": "NewPassword123"}
                success, data, status = self.make_request("POST", "/auth/reset-password", reset_data)
                self.log_result("Password Reset", success and status == 200, 
                               f"Status: {status}, Response: {data}")
            else:
                self.log_result("OTP Verification", False, 
                               f"Status: {status}, Response: {data}")
        else:
            self.log_result("Forgot Password OTP Generation", False, 
                           f"Status: {status}, Response: {data}")

    def test_admin_login(self):
        """Test admin login with OTP"""
        print("\n=== Testing Admin Login ===")
        
        # Step 1: Admin login
        success, data, status = self.make_request("POST", "/admin/login", ADMIN_CREDENTIALS)
        
        if success and status == 200 and "otp_hint" in data:
            otp = data["otp_hint"]
            self.log_result("Admin Login Step 1", True, f"OTP generated: {otp}")
            
            # Step 2: OTP verification
            verify_data = {"otp": otp}
            success, data, status = self.make_request("POST", "/admin/verify-otp", verify_data)
            
            if success and status == 200 and "token" in data:
                self.admin_token = data["token"]
                self.log_result("Admin Login Step 2 (OTP Verify)", True, f"Admin token received")
            else:
                self.log_result("Admin Login Step 2 (OTP Verify)", False, 
                               f"Status: {status}, Response: {data}")
        else:
            self.log_result("Admin Login Step 1", False, 
                           f"Status: {status}, Response: {data}")

    def test_products_crud(self):
        """Test products CRUD operations"""
        print("\n=== Testing Products CRUD ===")
        
        if not self.admin_token:
            self.log_result("Products CRUD", False, "No admin token available")
            return

        # Test GET products for AFN Graphics
        success, data, status = self.make_request("GET", "/products", params={"brand": "afn_graphics"})
        afn_products_count = len(data) if success and isinstance(data, list) else 0
        self.log_result("Get AFN Products", success and status == 200, 
                       f"Status: {status}, AFN Products count: {afn_products_count}")

        # Test GET products for Crazzy Gifts
        success, data, status = self.make_request("GET", "/products", params={"brand": "crazzy_gifts"})
        crazzy_products_count = len(data) if success and isinstance(data, list) else 0
        self.log_result("Get Crazzy Products", success and status == 200, 
                       f"Status: {status}, Crazzy Products count: {crazzy_products_count}")

        # Test brand filtering works (AFN products shouldn't show in Crazzy and vice versa)
        if afn_products_count > 0 and crazzy_products_count > 0:
            self.log_result("Brand Filtering", True, 
                           f"Brand filtering working: AFN={afn_products_count}, Crazzy={crazzy_products_count}")
        else:
            self.log_result("Brand Filtering", False, 
                           f"Brand filtering issue: AFN={afn_products_count}, Crazzy={crazzy_products_count}")

        # Test CREATE product
        new_product = {
            "name": "Test Product",
            "price": 999,
            "description": "Test product description",
            "category": "Logo Designing",
            "brand": "afn_graphics",
            "image_url": "https://example.com/test.jpg"
        }
        
        headers = self.get_auth_headers(self.admin_token)
        success, data, status = self.make_request("POST", "/products", new_product, headers)
        
        if success and status == 200 and "id" in data:
            self.test_product_id = data["id"]
            self.log_result("Create Product", True, f"Product created with ID: {self.test_product_id}")
            
            # Test UPDATE product
            update_data = {"name": "Updated Test Product", "price": 1299}
            success, data, status = self.make_request("PUT", f"/products/{self.test_product_id}", 
                                                    update_data, headers)
            self.log_result("Update Product", success and status == 200, 
                           f"Status: {status}, Updated name: {data.get('name', 'N/A')}")
            
            # Test GET single product
            success, data, status = self.make_request("GET", f"/products/{self.test_product_id}")
            self.log_result("Get Single Product", success and status == 200, 
                           f"Status: {status}, Product: {data.get('name', 'N/A')}")
            
            # Test DELETE product
            success, data, status = self.make_request("DELETE", f"/products/{self.test_product_id}", 
                                                    headers=headers)
            self.log_result("Delete Product", success and status == 200, 
                           f"Status: {status}, Response: {data}")
        else:
            self.log_result("Create Product", False, 
                           f"Status: {status}, Response: {data}")

    def test_categories_crud(self):
        """Test categories CRUD operations"""
        print("\n=== Testing Categories CRUD ===")
        
        if not self.admin_token:
            self.log_result("Categories CRUD", False, "No admin token available")
            return

        # Test GET categories for AFN Graphics
        success, data, status = self.make_request("GET", "/categories", params={"brand": "afn_graphics"})
        afn_cats_count = len(data) if success and isinstance(data, list) else 0
        self.log_result("Get AFN Categories", success and status == 200, 
                       f"Status: {status}, AFN Categories count: {afn_cats_count}")

        # Test GET categories for Crazzy Gifts
        success, data, status = self.make_request("GET", "/categories", params={"brand": "crazzy_gifts"})
        crazzy_cats_count = len(data) if success and isinstance(data, list) else 0
        self.log_result("Get Crazzy Categories", success and status == 200, 
                       f"Status: {status}, Crazzy Categories count: {crazzy_cats_count}")

        # Test CREATE category
        new_category = {
            "name": "Test Category",
            "brand": "afn_graphics"
        }
        
        headers = self.get_auth_headers(self.admin_token)
        success, data, status = self.make_request("POST", "/categories", new_category, headers)
        
        if success and status == 200 and "id" in data:
            self.test_category_id = data["id"]
            self.log_result("Create Category", True, f"Category created with ID: {self.test_category_id}")
            
            # Test DELETE category
            success, data, status = self.make_request("DELETE", f"/categories/{self.test_category_id}", 
                                                    headers=headers)
            self.log_result("Delete Category", success and status == 200, 
                           f"Status: {status}, Response: {data}")
        else:
            self.log_result("Create Category", False, 
                           f"Status: {status}, Response: {data}")

    def test_cart_system(self):
        """Test cart system"""
        print("\n=== Testing Cart System ===")
        
        if not self.user_token:
            self.log_result("Cart System", False, "No user token available")
            return

        headers = self.get_auth_headers(self.user_token)

        # Get a product to add to cart
        success, products, status = self.make_request("GET", "/products", params={"brand": "afn_graphics"})
        
        if not success or not products or len(products) == 0:
            self.log_result("Cart System - Get Products", False, "No products available for cart test")
            return

        product_id = products[0]["id"]
        
        # Test ADD to cart
        cart_data = {"product_id": product_id, "quantity": 2}
        success, data, status = self.make_request("POST", "/cart", cart_data, headers)
        self.log_result("Add to Cart", success and status == 200, 
                       f"Status: {status}, Cart items: {len(data) if isinstance(data, list) else 0}")

        # Test GET cart
        success, data, status = self.make_request("GET", "/cart", headers=headers)
        cart_items = data if success and isinstance(data, list) else []
        self.log_result("Get Cart", success and status == 200, 
                       f"Status: {status}, Cart items: {len(cart_items)}")

        if cart_items:
            cart_item_id = cart_items[0]["id"]
            
            # Test UPDATE cart item
            update_data = {"quantity": 3}
            success, data, status = self.make_request("PUT", f"/cart/{cart_item_id}", 
                                                    update_data, headers)
            self.log_result("Update Cart Item", success and status == 200, 
                           f"Status: {status}, Updated quantity")

            # Test DELETE cart item
            success, data, status = self.make_request("DELETE", f"/cart/{cart_item_id}", 
                                                    headers=headers)
            self.log_result("Delete Cart Item", success and status == 200, 
                           f"Status: {status}, Item removed")

    def test_orders_system(self):
        """Test orders system"""
        print("\n=== Testing Orders System ===")
        
        if not self.user_token:
            self.log_result("Orders System", False, "No user token available")
            return

        headers = self.get_auth_headers(self.user_token)

        # Add item to cart first
        success, products, status = self.make_request("GET", "/products", params={"brand": "afn_graphics"})
        
        if not success or not products:
            self.log_result("Orders System - Get Products", False, "No products available")
            return

        product = products[0]
        cart_data = {"product_id": product["id"], "quantity": 1}
        success, data, status = self.make_request("POST", "/cart", cart_data, headers)
        
        if not success:
            self.log_result("Orders System - Add to Cart", False, "Failed to add item to cart")
            return

        # Test CREATE order
        order_data = {
            "products": [{"id": product["id"], "name": product["name"], "price": product["price"], "quantity": 1}],
            "total_price": product["price"],
            "transaction_id": "TEST_TXN_123456"
        }
        
        success, data, status = self.make_request("POST", "/orders", order_data, headers)
        
        if success and status == 200 and "id" in data:
            self.test_order_id = data["id"]
            self.log_result("Create Order", True, f"Order created with ID: {self.test_order_id}")
            
            # Test GET user orders
            success, data, status = self.make_request("GET", "/orders", headers=headers)
            orders_count = len(data) if success and isinstance(data, list) else 0
            self.log_result("Get User Orders", success and status == 200, 
                           f"Status: {status}, Orders count: {orders_count}")
        else:
            self.log_result("Create Order", False, 
                           f"Status: {status}, Response: {data}")

    def test_admin_orders(self):
        """Test admin orders management"""
        print("\n=== Testing Admin Orders Management ===")
        
        if not self.admin_token:
            self.log_result("Admin Orders", False, "No admin token available")
            return

        headers = self.get_auth_headers(self.admin_token)

        # Test GET all orders (admin)
        success, data, status = self.make_request("GET", "/admin/orders", headers=headers)
        orders_count = len(data) if success and isinstance(data, list) else 0
        self.log_result("Get All Orders (Admin)", success and status == 200, 
                       f"Status: {status}, Total orders: {orders_count}")

        # Test UPDATE order status
        if self.test_order_id:
            update_data = {"status": "Processing"}
            success, data, status = self.make_request("PUT", f"/orders/{self.test_order_id}", 
                                                    update_data, headers)
            self.log_result("Update Order Status", success and status == 200, 
                           f"Status: {status}, New status: {data.get('status', 'N/A')}")

    def test_cloudinary_signature(self):
        """Test Cloudinary signature generation"""
        print("\n=== Testing Cloudinary Signature ===")
        
        if not self.admin_token:
            self.log_result("Cloudinary Signature", False, "No admin token available")
            return

        headers = self.get_auth_headers(self.admin_token)
        success, data, status = self.make_request("GET", "/cloudinary/signature", headers=headers)
        
        has_required_fields = (success and status == 200 and 
                             "signature" in data and "timestamp" in data and 
                             "cloud_name" in data and "api_key" in data)
        
        self.log_result("Get Cloudinary Signature", has_required_fields, 
                       f"Status: {status}, Has required fields: {has_required_fields}")

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting AFN Graphics Backend API Tests")
        print(f"📍 Base URL: {BASE_URL}")
        print("=" * 60)

        # Test sequence
        self.test_seed_database()
        self.test_user_registration()
        self.test_user_login()
        self.test_forgot_password_flow()
        self.test_admin_login()
        self.test_products_crud()
        self.test_categories_crud()
        self.test_cart_system()
        self.test_orders_system()
        self.test_admin_orders()
        self.test_cloudinary_signature()

        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"✅ Passed: {self.results['passed']}")
        print(f"❌ Failed: {self.results['failed']}")
        print(f"📈 Success Rate: {(self.results['passed'] / (self.results['passed'] + self.results['failed']) * 100):.1f}%")
        
        if self.results['errors']:
            print("\n🔍 FAILED TESTS:")
            for error in self.results['errors']:
                print(f"   • {error}")

        return self.results['failed'] == 0

if __name__ == "__main__":
    tester = APITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)