'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Toaster, toast } from 'sonner'
import {
  Search, ShoppingCart, User, LogOut, Menu, X, Plus, Minus, Trash2, Edit,
  Phone, Mail, MapPin, ArrowLeft, Upload, Package, Clock, CheckCircle,
  AlertCircle, Eye, EyeOff, ChevronRight, Palette, FileText, CreditCard,
  Image as ImageIcon, Tag, Printer, Shield, Star, Heart, Layers, Grid3X3,
  LayoutDashboard, Settings, Users, ShoppingBag, Info, MessageCircle, Lock,
  Gift, Coffee, Shirt, Frame, Key, Box, Smartphone, Armchair, CircleDot, PenTool,
  ArrowLeftRight, Store
} from 'lucide-react'

const AFN_LOGO = 'https://customer-assets.emergentagent.com/job_afn-design-mart/artifacts/edw1si2v_AFN%20New%20Logo.png'
const CRAZZY_LOGO = 'https://customer-assets.emergentagent.com/job_afn-design-mart/artifacts/rivzvsxn_Crazy%20Gifts.png'
const QR_URL = 'https://customer-assets.emergentagent.com/job_afn-design-mart/artifacts/ezps4j9i_WhatsApp%20Image%202026-04-21%20at%2006.18.34.jpeg'
const AFN_HERO_BG = 'https://customer-assets.emergentagent.com/job_afn-design-mart/artifacts/we7n5094_WhatsApp%20Image%202026-04-27%20at%2011.27.05.jpeg'
const PHONE_NO = '+91 63607 72095'

const BRAND_CONFIG = {
  afn_graphics: {
    name: 'AFN Graphics',
    tagline: 'A Unique Designing Solutions',
    logo: AFN_LOGO,
    quote: '"You Dream it... We Design it...!!!"',
    quote2: '"Big Ideas, Great Results"',
    primary: '#e91e8c',
    secondary: '#7c3aed',
    accent: '#c084fc',
    heroBg: 'linear-gradient(135deg, #1a0a2e 0%, #0d0d1a 40%, #2d0a3e 100%)',
    heroText: '#e91e8c',
    cardBorder: 'rgba(233,30,140,0.3)',
    buttonBg: '#e91e8c',
    buttonHover: '#d11678',
    badgeBg: '#7c3aed',
    quoteBg: 'linear-gradient(135deg, #7c3aed, #e91e8c)',
    lightBg: '#fdf2f8',
    lightBorder: '#fce7f3',
  },
  crazzy_gifts: {
    name: 'Crazzy Gifts World',
    tagline: 'A Complete Online Gift Solutions',
    logo: CRAZZY_LOGO,
    quote: '"Ordinary GIFT to Extra-Ordinary PERSON"',
    quote2: '"Making Every Moment Special"',
    primary: '#2dd4bf',
    secondary: '#0d9488',
    accent: '#5eead4',
    heroBg: 'linear-gradient(135deg, #042f2e 0%, #0d0d1a 40%, #0a3d3a 100%)',
    heroText: '#2dd4bf',
    cardBorder: 'rgba(45,212,191,0.3)',
    buttonBg: '#0d9488',
    buttonHover: '#0a7a70',
    badgeBg: '#0d9488',
    quoteBg: 'linear-gradient(135deg, #0d9488, #2dd4bf)',
    lightBg: '#f0fdfa',
    lightBorder: '#ccfbf1',
  }
}

const AFN_CAT_ICONS = { 'Logo Designing': Palette, 'Banner Design': ImageIcon, 'Visiting Cards': CreditCard, 'Brochures': FileText, 'Bill Books': FileText, 'Employee ID Cards': Shield, 'Lanyard Prints': Tag, 'Labels & Stickers': Layers }
const CRAZZY_CAT_ICONS = { 'Personalized Mugs': Coffee, 'Custom T-Shirts': Shirt, 'Photo Frames': Frame, 'Keychains': Key, 'Gift Hampers': Gift, 'Mobile Covers': Smartphone, 'Cushion Covers': Armchair, 'Wall Clocks': Clock, 'Personalized Pens': PenTool }

const api = {
  get: async (url, token) => {
    const res = await fetch(`/api${url}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Request failed') }
    return res.json()
  },
  post: async (url, data, token) => {
    const res = await fetch(`/api${url}`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(data) })
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Request failed') }
    return res.json()
  },
  put: async (url, data, token) => {
    const res = await fetch(`/api${url}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(data) })
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Request failed') }
    return res.json()
  },
  del: async (url, token) => {
    const res = await fetch(`/api${url}`, { method: 'DELETE', headers: token ? { Authorization: `Bearer ${token}` } : {} })
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Request failed') }
    return res.json()
  }
}

// ========== BRAND SELECTOR ==========
function BrandSelector({ onSelect }) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{backgroundImage: `url(${AFN_HERO_BG})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(20px)'}} />
      <div className="relative z-10 max-w-5xl w-full">
        <h1 className="text-center text-white text-3xl md:text-5xl font-bold mb-3">Welcome</h1>
        <p className="text-center text-gray-400 mb-12 text-lg">Choose your destination</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {/* AFN Graphics */}
          <div onClick={() => onSelect('afn_graphics')} className="cursor-pointer group">
            <div className="rounded-3xl text-center border-2 transition-all duration-500 group-hover:scale-[1.03] overflow-hidden relative" style={{borderColor: 'rgba(233,30,140,0.3)', boxShadow: '0 0 0px rgba(233,30,140,0)'}} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 50px rgba(233,30,140,0.4)'} onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 0px rgba(233,30,140,0)'}>
              <div className="absolute inset-0"><img src={AFN_HERO_BG} alt="" className="w-full h-full object-cover" /></div>
              <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(26,10,46,0.85))'}} />
              <div className="relative p-8 md:p-10">
                <img src={AFN_LOGO} alt="AFN Graphics" className="h-32 w-32 mx-auto mb-5 rounded-2xl object-contain" style={{background: 'rgba(0,0,0,0.6)', border: '2px solid rgba(233,30,140,0.3)', boxShadow: '0 0 25px rgba(233,30,140,0.2)'}} />
                <h2 className="text-3xl md:text-4xl font-black mb-2" style={{color: '#e91e8c', textShadow: '0 3px 15px rgba(233,30,140,0.4), 0 1px 3px rgba(0,0,0,0.8)'}}>AFN Graphics</h2>
                <p className="text-purple-300 mb-3 font-light tracking-wider">a unique designing solutions</p>
                <p className="text-pink-300 italic text-sm mb-6" style={{textShadow: '0 1px 5px rgba(0,0,0,0.8)'}}>\"You Dream it... We Design it...!!!\"</p>
                <div className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold transition-all group-hover:px-10" style={{background: 'rgba(233,30,140,0.25)', color: '#f9a8d4', border: '1px solid rgba(233,30,140,0.4)'}}>Enter Store <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></div>
              </div>
            </div>
          </div>
          {/* Crazzy Gifts */}
          <div onClick={() => onSelect('crazzy_gifts')} className="cursor-pointer group">
            <div className="rounded-3xl text-center border-2 transition-all duration-500 group-hover:scale-[1.03] overflow-hidden relative" style={{background: 'linear-gradient(135deg, #000000 0%, #042f2e 50%, #000000 100%)', borderColor: 'rgba(45,212,191,0.3)', boxShadow: '0 0 0px rgba(45,212,191,0)'}} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 50px rgba(45,212,191,0.4)'} onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 0px rgba(45,212,191,0)'}>
              <div className="absolute inset-4 border rounded-2xl opacity-15" style={{borderColor: '#2dd4bf'}} />
              <div className="relative p-8 md:p-10">
                <img src={CRAZZY_LOGO} alt="Crazzy Gifts" className="h-32 w-32 mx-auto mb-5 rounded-2xl object-contain" style={{background: 'rgba(0,0,0,0.6)', border: '2px solid rgba(45,212,191,0.3)', boxShadow: '0 0 25px rgba(45,212,191,0.2)'}} />
                <h2 className="text-3xl md:text-4xl font-black mb-1" style={{fontFamily: 'Playfair Display, serif', color: '#2dd4bf', textShadow: '0 3px 0 #064e45, 0 6px 12px rgba(0,0,0,0.8), 0 0 30px rgba(45,212,191,0.3)'}}>Crazzy Gifts</h2>
                <h3 className="text-2xl md:text-3xl font-black mb-3" style={{fontFamily: 'Playfair Display, serif', color: '#99f6e4', textShadow: '0 2px 0 #0d9488, 0 4px 10px rgba(0,0,0,0.8), 0 0 20px rgba(153,246,228,0.2)'}}>World</h3>
                <p className="text-teal-300 mb-3 font-light tracking-wider">A Complete Online Gift Solutions...</p>
                <p className="text-teal-200 italic text-sm mb-6" style={{textShadow: '0 1px 5px rgba(0,0,0,0.8)'}}>\"Ordinary GIFT to Extra-Ordinary PERSON\"</p>
                <div className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold transition-all group-hover:px-10" style={{background: 'rgba(45,212,191,0.2)', color: '#5eead4', border: '1px solid rgba(45,212,191,0.4)'}}>Enter Store <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ========== NAVBAR ==========
function Navbar({ currentPage, setCurrentPage, user, cart, onLogout, activeBrand, setActiveBrand, theme }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const cartCount = cart?.reduce((s, i) => s + i.quantity, 0) || 0
  const otherBrand = activeBrand === 'afn_graphics' ? 'crazzy_gifts' : 'afn_graphics'
  const otherTheme = BRAND_CONFIG[otherBrand]

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm" style={{borderColor: theme.lightBorder}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage(user?.role === 'admin' ? 'admin' : user ? 'home' : 'landing')}>
            <img src={theme.logo} alt={theme.name} className="h-10 w-10 rounded-lg object-contain" style={{background: '#000'}} />
            <div className="hidden sm:block">
              <h1 className="text-base font-bold leading-tight" style={{color: theme.primary}}>{theme.name}</h1>
              <p className="text-[10px] font-medium -mt-0.5" style={{color: theme.secondary}}>{theme.tagline}</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {user && user.role === 'admin' ? (
              <Button variant="ghost" size="sm" onClick={() => setCurrentPage('admin')} className={currentPage === 'admin' ? 'font-semibold' : ''} style={currentPage === 'admin' ? {color: theme.primary, background: theme.lightBg} : {}}><LayoutDashboard className="h-4 w-4 mr-1" />Dashboard</Button>
            ) : user ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => setCurrentPage('home')} className={currentPage === 'home' ? 'font-semibold' : ''} style={currentPage === 'home' ? {color: theme.primary, background: theme.lightBg} : {}}>Home</Button>
                <Button variant="ghost" size="sm" onClick={() => setCurrentPage('orders')} className={currentPage === 'orders' ? 'font-semibold' : ''} style={currentPage === 'orders' ? {color: theme.primary, background: theme.lightBg} : {}}>My Orders</Button>
              </>
            ) : null}
            {(!user || user.role !== 'admin') && <>
              <Button variant="ghost" size="sm" onClick={() => setCurrentPage('about')}>About</Button>
              <Button variant="ghost" size="sm" onClick={() => setCurrentPage('contact')}>Contact</Button>
            </>}
            <Button variant="outline" size="sm" className="ml-2 flex items-center gap-1.5" onClick={() => { setActiveBrand(otherBrand); setCurrentPage(user?.role === 'admin' ? 'admin' : 'landing') }}>
              <ArrowLeftRight className="h-3.5 w-3.5" />
              <img src={otherTheme.logo} className="h-5 w-5 rounded object-contain" style={{background:'#000'}} />
              <span className="text-xs hidden lg:inline">{otherTheme.name}</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {user && user.role !== 'admin' && (
              <Button variant="ghost" size="sm" className="relative" onClick={() => setCurrentPage('cart')}>
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && <span className="absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold" style={{background: theme.buttonBg}}>{cartCount}</span>}
              </Button>
            )}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-gray-600">{user.name || user.username}</span>
                <Button variant="ghost" size="sm" onClick={onLogout}><LogOut className="h-4 w-4" /></Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage('login')}>Login</Button>
                <Button size="sm" style={{background: theme.buttonBg, color: '#fff'}} onClick={() => setCurrentPage('register')}>Register</Button>
              </div>
            )}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden py-3 border-t animate-fadeIn" style={{borderColor: theme.lightBorder}}>
            <div className="flex flex-col gap-1">
              {user && user.role === 'admin' ? (
                <Button variant="ghost" className="justify-start" onClick={() => { setCurrentPage('admin'); setMenuOpen(false) }}><LayoutDashboard className="h-4 w-4 mr-2" />Dashboard</Button>
              ) : user ? (
                <><Button variant="ghost" className="justify-start" onClick={() => { setCurrentPage('home'); setMenuOpen(false) }}>Home</Button><Button variant="ghost" className="justify-start" onClick={() => { setCurrentPage('orders'); setMenuOpen(false) }}>My Orders</Button></>
              ) : null}
              {(!user || user.role !== 'admin') && <>
                <Button variant="ghost" className="justify-start" onClick={() => { setCurrentPage('about'); setMenuOpen(false) }}>About</Button>
                <Button variant="ghost" className="justify-start" onClick={() => { setCurrentPage('contact'); setMenuOpen(false) }}>Contact</Button>
              </>}
              <Button variant="ghost" className="justify-start" onClick={() => { setActiveBrand(otherBrand); setCurrentPage(user?.role === 'admin' ? 'admin' : 'landing'); setMenuOpen(false) }}><ArrowLeftRight className="h-4 w-4 mr-2" />Switch to {otherTheme.name}</Button>
              {user ? <Button variant="ghost" className="justify-start text-red-500" onClick={() => { onLogout(); setMenuOpen(false) }}>Logout</Button> : <><Button variant="ghost" className="justify-start" onClick={() => { setCurrentPage('login'); setMenuOpen(false) }}>Login</Button><Button variant="ghost" className="justify-start" style={{color: theme.primary}} onClick={() => { setCurrentPage('register'); setMenuOpen(false) }}>Register</Button></>}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// ========== PRODUCT CARD ==========
function ProductCard({ product, showPrice = true, onView, onAddToCart, user, theme }) {
  return (
    <Card className="card-hover overflow-hidden border group" style={{borderColor: 'rgba(0,0,0,0.08)'}}>
      <div className="relative overflow-hidden aspect-[4/3] bg-gray-100">
        <img src={product.image_url || 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400'} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <Badge className="absolute top-3 left-3 text-white text-xs" style={{background: theme.badgeBg}}>{product.category}</Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
        {showPrice ? (
          <p className="text-xl font-bold" style={{color: theme.primary}}>Rs. {product.price?.toLocaleString('en-IN')}</p>
        ) : (
          <div className="flex items-center gap-1" style={{color: theme.secondary}}><Phone className="h-4 w-4" /><span className="text-sm font-medium">Contact for pricing</span></div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => onView(product)}><Eye className="h-4 w-4 mr-1" /> View</Button>
        {showPrice && user && user.role !== 'admin' && (
          <Button size="sm" className="flex-1 text-white" style={{background: theme.buttonBg}} onClick={() => onAddToCart(product.id)}><ShoppingCart className="h-4 w-4 mr-1" /> Add</Button>
        )}
      </CardFooter>
    </Card>
  )
}

// ========== FOOTER ==========
function Footer({ setCurrentPage, theme, activeBrand }) {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={theme.logo} alt={theme.name} className="h-14 w-14 rounded-xl object-contain" style={{background:'#000', border: `1px solid ${theme.cardBorder}`}} />
              <div>
                <h2 className="text-xl font-bold" style={{color: theme.primary}}>{theme.name}</h2>
                <p className="text-sm" style={{color: theme.accent}}>{theme.tagline}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm italic mb-2">{theme.quote}</p>
            <p className="text-gray-400 text-sm italic">{theme.quote2}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <span className="hover:text-white cursor-pointer" onClick={() => setCurrentPage('about')}>About Us</span>
              <span className="hover:text-white cursor-pointer" onClick={() => setCurrentPage('contact')}>Contact</span>
              <span className="hover:text-white cursor-pointer" onClick={() => setCurrentPage('admin-login')}>Admin Panel</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <div className="flex items-center gap-2"><Phone className="h-4 w-4" style={{color: theme.primary}} />{PHONE_NO}</div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4" style={{color: theme.primary}} />afngraphics7867@gmail.com</div>
            </div>
          </div>
        </div>
        <Separator className="my-8 bg-gray-800" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">&copy; 2025 {theme.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <img src={AFN_LOGO} alt="AFN" className="h-8 w-8 rounded object-contain opacity-60 hover:opacity-100 transition-opacity cursor-pointer" style={{background:'#000'}} />
            <img src={CRAZZY_LOGO} alt="Crazzy" className="h-8 w-8 rounded object-contain opacity-60 hover:opacity-100 transition-opacity cursor-pointer" style={{background:'#000'}} />
          </div>
        </div>
      </div>
    </footer>
  )
}

// ========== LANDING PAGE ==========
function LandingPage({ products, categories, setCurrentPage, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, theme, activeBrand }) {
  const catIcons = activeBrand === 'afn_graphics' ? AFN_CAT_ICONS : CRAZZY_CAT_ICONS
  const filtered = products.filter(p => {
    const matchCat = !selectedCategory || selectedCategory === 'all' || p.category === selectedCategory
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="animate-fadeIn">
      {/* AFN Graphics Hero - with background image */}
      {activeBrand === 'afn_graphics' ? (
        <div className="relative overflow-hidden min-h-[520px] md:min-h-[600px] flex items-center">
          <div className="absolute inset-0"><img src={AFN_HERO_BG} alt="" className="w-full h-full object-cover" /></div>
          <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%)'}} />
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center">
              <img src={AFN_LOGO} alt="AFN Graphics" className="h-24 w-24 md:h-32 md:w-32 mx-auto mb-6 rounded-2xl object-contain animate-pulse-glow" style={{background: 'rgba(0,0,0,0.7)', border: '2px solid rgba(233,30,140,0.5)', boxShadow: '0 0 30px rgba(233,30,140,0.3)'}} />
              <h1 className="text-5xl md:text-7xl lg:text-8xl mb-3" style={{fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontWeight: 800, letterSpacing: '2px'}}>
                <span style={{color: '#e91e8c', textShadow: '0 0 60px rgba(233,30,140,0.5), 0 4px 15px rgba(0,0,0,0.7), 2px 2px 0 rgba(124,58,237,0.4)'}}>AFN </span>
                <span className="text-white" style={{textShadow: '0 0 30px rgba(255,255,255,0.25), 0 4px 15px rgba(0,0,0,0.7), 2px 2px 0 rgba(233,30,140,0.3)'}}>Graphics</span>
              </h1>
              <p className="text-xl md:text-2xl mb-3 tracking-[0.25em] uppercase" style={{color: '#c084fc', textShadow: '0 2px 10px rgba(0,0,0,0.8)', fontWeight: 300, letterSpacing: '0.25em'}}>a unique designing solutions</p>
              <p className="text-2xl md:text-3xl font-bold mb-10" style={{fontFamily: 'Playfair Display, serif', fontStyle: 'italic', color: '#f9a8d4', textShadow: '0 2px 15px rgba(0,0,0,0.8)'}}>\"You Dream it... We Design it...!!!\"</p>
              <div className="max-w-xl mx-auto relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-12 pr-4 h-12 rounded-full bg-white/95 border-0 text-gray-900 text-lg shadow-2xl" />
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Button className="border-pink-400/50 text-white hover:text-white hover:border-pink-400 px-8" variant="outline" style={{background: 'rgba(233,30,140,0.2)', borderColor: 'rgba(233,30,140,0.5)', backdropFilter: 'blur(10px)'}} onClick={() => setCurrentPage('login')}>Login</Button>
                <Button className="text-white px-8 shadow-lg" style={{background: '#e91e8c', boxShadow: '0 4px 20px rgba(233,30,140,0.4)'}} onClick={() => setCurrentPage('register')}>Get Started</Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Crazzy Gifts World Hero - vibrant 3D */
        <div className="relative overflow-hidden min-h-[520px] md:min-h-[600px] flex items-center" style={{background: '#000'}}>
          {/* Animated gradient blobs */}
          <div className="absolute inset-0" style={{background: 'radial-gradient(circle 600px at 25% 40%, rgba(13,148,136,0.25) 0%, transparent 70%), radial-gradient(circle 500px at 75% 60%, rgba(45,212,191,0.2) 0%, transparent 70%), radial-gradient(circle 400px at 50% 20%, rgba(94,234,212,0.1) 0%, transparent 70%)'}} />
          {/* Sparkle dots */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-2 h-2 rounded-full animate-pulse" style={{background: '#2dd4bf', top: '15%', left: '10%', boxShadow: '0 0 10px #2dd4bf'}} />
            <div className="absolute w-1.5 h-1.5 rounded-full animate-pulse" style={{background: '#5eead4', top: '25%', right: '15%', boxShadow: '0 0 8px #5eead4', animationDelay: '0.5s'}} />
            <div className="absolute w-2 h-2 rounded-full animate-pulse" style={{background: '#2dd4bf', bottom: '20%', left: '20%', boxShadow: '0 0 10px #2dd4bf', animationDelay: '1s'}} />
            <div className="absolute w-1 h-1 rounded-full animate-pulse" style={{background: '#99f6e4', top: '60%', right: '25%', boxShadow: '0 0 6px #99f6e4', animationDelay: '1.5s'}} />
            <div className="absolute w-1.5 h-1.5 rounded-full animate-pulse" style={{background: '#2dd4bf', bottom: '35%', right: '10%', boxShadow: '0 0 8px #2dd4bf', animationDelay: '0.7s'}} />
            <div className="absolute w-1 h-1 rounded-full animate-pulse" style={{background: '#5eead4', top: '40%', left: '30%', boxShadow: '0 0 6px #5eead4', animationDelay: '1.2s'}} />
          </div>
          {/* Double teal border frame */}
          <div className="absolute inset-3 md:inset-6 border rounded-3xl opacity-10" style={{borderColor: '#2dd4bf'}} />
          <div className="absolute inset-6 md:inset-10 border rounded-2xl opacity-5" style={{borderColor: '#5eead4'}} />
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <div className="text-center">
              <img src={CRAZZY_LOGO} alt="Crazzy Gifts" className="h-28 w-28 md:h-36 md:w-36 mx-auto mb-8 rounded-2xl object-contain animate-pulse-glow" style={{background: 'rgba(0,0,0,0.8)', border: '2px solid rgba(45,212,191,0.4)', boxShadow: '0 0 40px rgba(45,212,191,0.3), 0 0 80px rgba(45,212,191,0.1)'}} />
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-1 leading-none" style={{fontFamily: 'Playfair Display, serif', fontStyle: 'italic'}}>
                <span style={{color: '#2dd4bf', textShadow: '0 0 80px rgba(45,212,191,0.5), 0 5px 0 #0a5c52, 0 10px 0 #064e45, 0 15px 30px rgba(0,0,0,0.9)'}}>Crazzy</span>
              </h1>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-1 leading-none" style={{fontFamily: 'Playfair Display, serif', fontStyle: 'italic'}}>
                <span style={{color: '#5eead4', textShadow: '0 0 60px rgba(94,234,212,0.4), 0 4px 0 #0d7a6f, 0 8px 0 #065f55, 0 12px 25px rgba(0,0,0,0.9)'}}>Gifts </span>
                <span style={{color: '#99f6e4', textShadow: '0 0 50px rgba(153,246,228,0.3), 0 4px 0 #0d9488, 0 8px 20px rgba(0,0,0,0.9)'}}>World</span>
              </h1>
              {/* Decorative line */}
              <div className="flex items-center justify-center gap-3 my-5">
                <div className="h-[1px] w-16 md:w-24" style={{background: 'linear-gradient(to right, transparent, #2dd4bf)'}} />
                <Gift className="h-5 w-5" style={{color: '#2dd4bf', filter: 'drop-shadow(0 0 6px rgba(45,212,191,0.5))'}} />
                <div className="h-[1px] w-16 md:w-24" style={{background: 'linear-gradient(to left, transparent, #2dd4bf)'}} />
              </div>
              <p className="text-lg md:text-xl mb-6 tracking-[0.2em] uppercase font-light" style={{color: '#5eead4', textShadow: '0 2px 10px rgba(0,0,0,0.8)'}}>A Complete Online Gift Solutions...</p>
              <div className="mb-10 space-y-1">
                <p className="text-xl md:text-2xl" style={{color: '#ccfbf1', textShadow: '0 2px 8px rgba(0,0,0,0.8)', fontWeight: 500}}>
                  Ordinary <span className="text-4xl md:text-5xl font-black" style={{fontFamily: 'Playfair Display, serif', fontStyle: 'italic', color: '#2dd4bf', textShadow: '0 0 30px rgba(45,212,191,0.5), 0 4px 0 #064e45, 0 8px 20px rgba(0,0,0,0.8)'}}>GIFT</span> to
                </p>
                <p className="text-xl md:text-2xl" style={{color: '#ccfbf1', textShadow: '0 2px 8px rgba(0,0,0,0.8)', fontWeight: 500}}>
                  Extra-Ordinary <span className="text-4xl md:text-5xl font-black" style={{fontFamily: 'Playfair Display, serif', fontStyle: 'italic', color: '#2dd4bf', textShadow: '0 0 30px rgba(45,212,191,0.5), 0 4px 0 #064e45, 0 8px 20px rgba(0,0,0,0.8)'}}>PERSON</span>
                </p>
              </div>
              <div className="max-w-xl mx-auto relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input placeholder="Search gifts..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-12 pr-4 h-12 rounded-full bg-white/95 border-0 text-gray-900 text-lg shadow-2xl" />
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Button className="border-teal-400/50 text-white hover:text-white hover:border-teal-400 px-8" variant="outline" style={{background: 'rgba(45,212,191,0.15)', borderColor: 'rgba(45,212,191,0.5)', backdropFilter: 'blur(10px)'}} onClick={() => setCurrentPage('login')}>Login</Button>
                <Button className="text-white px-8 shadow-lg" style={{background: '#0d9488', boxShadow: '0 4px 20px rgba(13,148,136,0.4)'}} onClick={() => setCurrentPage('register')}>Get Started</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Horizontal Category Nav */}
      <div className="border-b" style={{borderColor: theme.lightBorder, background: theme.lightBg}}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-hide">
            <button className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${!selectedCategory || selectedCategory === 'all' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'}`} style={!selectedCategory || selectedCategory === 'all' ? {background: theme.buttonBg} : {}} onClick={() => setSelectedCategory('all')}>View All</button>
            {categories.map(cat => {
              const Icon = catIcons[cat.name] || Palette
              const isActive = selectedCategory === cat.name
              return <button key={cat.id} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${isActive ? 'text-white' : 'text-gray-600 hover:bg-gray-100'}`} style={isActive ? {background: theme.buttonBg} : {}} onClick={() => setSelectedCategory(cat.name)}><Icon className="h-3.5 w-3.5" />{cat.name}</button>
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-bold text-center mb-8">Our <span style={{color: theme.primary}}>Products</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(p => <ProductCard key={p.id} product={p} showPrice={true} onView={() => { window.__selectedProduct = p; setCurrentPage('product-detail') }} onAddToCart={() => setCurrentPage('login')} user={null} theme={theme} />)}
        </div>
        {filtered.length === 0 && <p className="text-center text-gray-500 py-12">No products found</p>}
      </div>

      <div className="py-16" style={{background: theme.quoteBg}}>
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{theme.quote2}</h2>
          <p className="text-white/80 text-lg">Professional services that bring your creative vision to life</p>
        </div>
      </div>
    </div>
  )
}

// ========== LOGIN ==========
function LoginPage({ setCurrentPage, onLogin, theme }) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const handleLogin = async (e) => {
    e.preventDefault(); setLoading(true)
    try { const d = await api.post('/auth/login', { identifier, password }); onLogin(d.token, d.user); toast.success('Login successful!') } catch (err) { toast.error(err.message) }
    setLoading(false)
  }
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4" style={{background: theme.lightBg}}>
      <Card className="w-full max-w-md animate-fadeIn">
        <CardHeader className="text-center">
          <img src={theme.logo} alt="Logo" className="h-16 w-16 mx-auto mb-2 rounded-xl object-contain" style={{background: '#000'}} />
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div><Label>Username or Phone</Label><Input placeholder="Enter username or phone" value={identifier} onChange={e => setIdentifier(e.target.value)} required /></div>
            <div><Label>Password</Label><div className="relative"><Input type={showPwd ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required /><button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowPwd(!showPwd)}>{showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
            <Button type="submit" className="w-full text-white" style={{background: theme.buttonBg}} disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
          </form>
          <div className="mt-4 text-center text-sm"><span className="cursor-pointer hover:underline" style={{color: theme.primary}} onClick={() => setCurrentPage('forgot-password')}>Forgot Password?</span></div>
          <Separator className="my-4" />
          <p className="text-center text-sm text-gray-500">Don't have an account? <span className="cursor-pointer hover:underline font-medium" style={{color: theme.primary}} onClick={() => setCurrentPage('register')}>Register</span></p>
        </CardContent>
      </Card>
    </div>
  )
}

// ========== REGISTER ==========
function RegisterPage({ setCurrentPage, onLogin, theme }) {
  const [form, setForm] = useState({ username: '', name: '', phone: '', email: '', password: '', address: '' })
  const [loading, setLoading] = useState(false)
  const handleRegister = async (e) => {
    e.preventDefault(); setLoading(true)
    try { const d = await api.post('/auth/register', form); onLogin(d.token, d.user); toast.success('Registration successful!') } catch (err) { toast.error(err.message) }
    setLoading(false)
  }
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4" style={{background: theme.lightBg}}>
      <Card className="w-full max-w-md animate-fadeIn">
        <CardHeader className="text-center"><img src={theme.logo} alt="Logo" className="h-16 w-16 mx-auto mb-2 rounded-xl object-contain" style={{background: '#000'}} /><CardTitle className="text-2xl">Create Account</CardTitle><CardDescription>Join {theme.name} today</CardDescription></CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-3">
            <div><Label>Username *</Label><Input placeholder="Choose a unique username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required /></div>
            <div><Label>Full Name *</Label><Input placeholder="Your full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
            <div><Label>Phone Number *</Label><Input placeholder="Phone number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required /></div>
            <div><Label>Email</Label><Input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
            <div><Label>Password *</Label><Input type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required /></div>
            <div><Label>Address</Label><Input placeholder="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
            <Button type="submit" className="w-full text-white" style={{background: theme.buttonBg}} disabled={loading}>{loading ? 'Creating...' : 'Register'}</Button>
          </form>
          <Separator className="my-4" />
          <p className="text-center text-sm text-gray-500">Already have an account? <span className="cursor-pointer hover:underline font-medium" style={{color: theme.primary}} onClick={() => setCurrentPage('login')}>Login</span></p>
        </CardContent>
      </Card>
    </div>
  )
}

// ========== FORGOT PASSWORD ==========
function ForgotPasswordPage({ setCurrentPage, theme }) {
  const [step, setStep] = useState(1)
  const [identifier, setIdentifier] = useState('')
  const [otp, setOtp] = useState('')
  const [userId, setUserId] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [otpHint, setOtpHint] = useState('')
  const [loading, setLoading] = useState(false)
  const sendOtp = async () => { setLoading(true); try { const d = await api.post('/auth/forgot-password', { identifier }); setOtpHint(d.otp_hint || ''); toast.success('OTP sent!'); setStep(2) } catch (e) { toast.error(e.message) } setLoading(false) }
  const verifyOtp = async () => { setLoading(true); try { const d = await api.post('/auth/verify-otp', { identifier, otp }); setUserId(d.user_id); toast.success('OTP verified!'); setStep(3) } catch (e) { toast.error(e.message) } setLoading(false) }
  const resetPwd = async () => { setLoading(true); try { await api.post('/auth/reset-password', { user_id: userId, new_password: newPassword }); toast.success('Password reset!'); setCurrentPage('login') } catch (e) { toast.error(e.message) } setLoading(false) }
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4" style={{background: theme.lightBg}}>
      <Card className="w-full max-w-md animate-fadeIn">
        <CardHeader className="text-center"><CardTitle>Forgot Password</CardTitle><CardDescription>Step {step} of 3</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && <><div><Label>Username or Phone</Label><Input value={identifier} onChange={e => setIdentifier(e.target.value)} /></div><Button className="w-full text-white" style={{background: theme.buttonBg}} onClick={sendOtp} disabled={loading}>{loading ? 'Sending...' : 'Send OTP'}</Button></>}
          {step === 2 && <>{otpHint && <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800"><AlertCircle className="inline h-4 w-4 mr-1" />OTP: <strong>{otpHint}</strong></div>}<div><Label>Enter OTP</Label><Input value={otp} onChange={e => setOtp(e.target.value)} /></div><Button className="w-full text-white" style={{background: theme.buttonBg}} onClick={verifyOtp} disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</Button></>}
          {step === 3 && <><div><Label>New Password</Label><Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} /></div><Button className="w-full text-white" style={{background: theme.buttonBg}} onClick={resetPwd} disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</Button></>}
          <Button variant="ghost" className="w-full" onClick={() => setCurrentPage('login')}><ArrowLeft className="h-4 w-4 mr-2" />Back to Login</Button>
        </CardContent>
      </Card>
    </div>
  )
}

// ========== HOME PAGE ==========
function HomePage({ products, categories, user, token, setCurrentPage, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, onAddToCart, viewMode, setViewMode, theme, activeBrand }) {
  const catIcons = activeBrand === 'afn_graphics' ? AFN_CAT_ICONS : CRAZZY_CAT_ICONS
  const filtered = products.filter(p => {
    const matchCat = !selectedCategory || selectedCategory === 'all' || p.category === selectedCategory
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })
  return (
    <div className="animate-fadeIn">
      <div className="py-12" style={{background: theme.heroBg}}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome, <span style={{color: theme.primary}}>{user?.name || user?.username}</span></h1>
          <p className="italic" style={{color: theme.accent}}>{theme.quote2}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="individual" value={viewMode} onValueChange={setViewMode} className="mb-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2"><TabsTrigger value="individual"><ShoppingBag className="h-4 w-4 mr-1.5" />Personal Orders</TabsTrigger><TabsTrigger value="bulk"><Package className="h-4 w-4 mr-1.5" />Bulk Production</TabsTrigger></TabsList>
        </Tabs>
        {viewMode === 'bulk' && (
          <div className="rounded-xl p-6 mb-6 text-center border" style={{background: theme.lightBg, borderColor: theme.lightBorder}}>
            <Package className="h-10 w-10 mx-auto mb-3" style={{color: theme.primary}} />
            <h3 className="text-lg font-semibold mb-2" style={{color: theme.secondary}}>Bulk Production Orders</h3>
            <p className="text-gray-600 mb-3">Prices may vary based on quantity and requirements.</p>
            <div className="flex items-center justify-center gap-2 font-bold text-lg" style={{color: theme.primary}}><Phone className="h-5 w-5" />{PHONE_NO}</div>
          </div>
        )}

        <div className="max-w-xl mx-auto mb-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-12 h-11 rounded-full" />
        </div>

        {/* Horizontal category nav */}
        <div className="flex items-center gap-1.5 pb-4 overflow-x-auto scrollbar-hide">
          <button className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${!selectedCategory || selectedCategory === 'all' ? 'text-white' : 'text-gray-600 border border-gray-200 hover:bg-gray-100'}`} style={!selectedCategory || selectedCategory === 'all' ? {background: theme.buttonBg} : {}} onClick={() => setSelectedCategory('all')}>All</button>
          {categories.map(cat => {
            const Icon = catIcons[cat.name] || Palette
            const isActive = selectedCategory === cat.name
            return <button key={cat.id} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 ${isActive ? 'text-white' : 'text-gray-600 border border-gray-200 hover:bg-gray-100'}`} style={isActive ? {background: theme.buttonBg} : {}} onClick={() => setSelectedCategory(cat.name)}><Icon className="h-3 w-3" />{cat.name}</button>
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(p => <ProductCard key={p.id} product={p} showPrice={viewMode === 'individual'} onView={() => { window.__selectedProduct = p; setCurrentPage('product-detail') }} onAddToCart={onAddToCart} user={user} theme={theme} />)}
        </div>
        {filtered.length === 0 && <p className="text-center text-gray-500 py-12">No products found</p>}
      </div>
    </div>
  )
}

// ========== PRODUCT DETAIL ==========
function ProductDetailPage({ product, user, viewMode, setCurrentPage, onAddToCart, theme }) {
  if (!product) return <div className="p-8 text-center">Product not found</div>
  const showPrice = viewMode === 'individual'
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fadeIn">
      <Button variant="ghost" className="mb-6" onClick={() => setCurrentPage(user ? 'home' : 'landing')}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="rounded-2xl overflow-hidden shadow-xl"><img src={product.image_url || 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600'} alt={product.name} className="w-full h-[400px] object-cover" /></div>
        <div>
          <Badge className="mb-3 text-white" style={{background: theme.badgeBg}}>{product.category}</Badge>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
          {showPrice ? <p className="text-3xl font-bold mb-6" style={{color: theme.primary}}>Rs. {product.price?.toLocaleString('en-IN')}</p> : (
            <div className="rounded-xl p-4 mb-6 border" style={{background: theme.lightBg, borderColor: theme.lightBorder}}>
              <p className="font-medium mb-2" style={{color: theme.secondary}}>Bulk Order Pricing</p>
              <p className="text-gray-600 text-sm mb-3">Prices vary based on quantity</p>
              <div className="flex items-center gap-2 font-bold" style={{color: theme.primary}}><Phone className="h-4 w-4" />{PHONE_NO}</div>
            </div>
          )}
          {showPrice && user && user.role !== 'admin' && <Button size="lg" className="w-full md:w-auto text-white" style={{background: theme.buttonBg}} onClick={() => { onAddToCart(product.id); toast.success('Added to cart!') }}><ShoppingCart className="h-5 w-5 mr-2" />Add to Cart</Button>}
          {!user && showPrice && <Button size="lg" className="text-white" style={{background: theme.buttonBg}} onClick={() => setCurrentPage('login')}>Login to Purchase</Button>}
        </div>
      </div>
    </div>
  )
}

// ========== CART ==========
function CartPage({ cart, setCurrentPage, onUpdateCart, onRemoveFromCart, theme }) {
  const total = cart.reduce((s, i) => s + (i.product_price * i.quantity), 0)
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><ShoppingCart className="h-6 w-6" style={{color: theme.primary}} />Shopping Cart</h1>
      {cart.length === 0 ? (
        <Card className="text-center py-12"><CardContent><ShoppingCart className="h-16 w-16 mx-auto text-gray-300 mb-4" /><p className="text-gray-500 mb-4">Your cart is empty</p><Button onClick={() => setCurrentPage('home')} className="text-white" style={{background: theme.buttonBg}}>Continue Shopping</Button></CardContent></Card>
      ) : (
        <>
          <div className="space-y-4 mb-8">{cart.map(item => (
            <Card key={item.id}><CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
              <img src={item.product_image || 'https://via.placeholder.com/80'} alt={item.product_name} className="w-20 h-20 object-cover rounded-lg" />
              <div className="flex-1 text-center sm:text-left"><h3 className="font-semibold">{item.product_name}</h3><p className="font-medium" style={{color: theme.primary}}>Rs. {item.product_price?.toLocaleString('en-IN')}</p></div>
              <div className="flex items-center gap-2"><Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onUpdateCart(item.id, Math.max(0, item.quantity - 1))}><Minus className="h-4 w-4" /></Button><span className="w-8 text-center font-semibold">{item.quantity}</span><Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onUpdateCart(item.id, item.quantity + 1)}><Plus className="h-4 w-4" /></Button></div>
              <p className="font-bold text-lg">Rs. {(item.product_price * item.quantity).toLocaleString('en-IN')}</p>
              <Button variant="ghost" size="icon" className="text-red-500" onClick={() => onRemoveFromCart(item.id)}><Trash2 className="h-5 w-5" /></Button>
            </CardContent></Card>
          ))}</div>
          <Card><CardContent className="p-6">
            <div className="flex justify-between text-lg mb-2"><span>Subtotal:</span><span>Rs. {total.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-lg mb-2"><span>GST (5%):</span><span>Rs. {(total * 0.05).toLocaleString('en-IN')}</span></div>
            <Separator className="my-3" />
            <div className="flex justify-between text-xl font-bold"><span>Total:</span><span style={{color: theme.primary}}>Rs. {(total * 1.05).toLocaleString('en-IN')}</span></div>
            <Button className="w-full mt-6 h-12 text-lg text-white" style={{background: theme.buttonBg}} onClick={() => setCurrentPage('payment')}>Proceed to Payment</Button>
          </CardContent></Card>
        </>
      )}
    </div>
  )
}

// ========== PAYMENT ==========
function PaymentPage({ cart, token, setCurrentPage, setCart, theme }) {
  const [txnId, setTxnId] = useState('')
  const [loading, setLoading] = useState(false)
  const total = cart.reduce((s, i) => s + (i.product_price * i.quantity), 0)
  const gst = total * 0.05
  const grand = total + gst
  const handlePay = async () => {
    if (!txnId.trim()) { toast.error('Enter transaction ID'); return }
    setLoading(true)
    try {
      const prods = cart.map(i => ({ product_id: i.product_id, product_name: i.product_name, quantity: i.quantity, price: i.product_price }))
      await api.post('/orders', { products: prods, total_price: grand, transaction_id: txnId }, token)
      setCart([]); toast.success('Order placed!'); setCurrentPage('orders')
    } catch (e) { toast.error(e.message) }
    setLoading(false)
  }
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fadeIn">
      <Button variant="ghost" className="mb-6" onClick={() => setCurrentPage('cart')}><ArrowLeft className="h-4 w-4 mr-2" />Back to Cart</Button>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><CreditCard className="h-6 w-6" style={{color: theme.primary}} />Payment</h1>
      <Card><CardContent className="p-6">
        <div className="rounded-xl p-4 mb-6" style={{background: theme.lightBg}}>
          <div className="flex justify-between mb-2"><span>Subtotal:</span><span>Rs. {total.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between mb-2"><span>GST (5%):</span><span>Rs. {gst.toLocaleString('en-IN',{minimumFractionDigits:2})}</span></div>
          <Separator className="my-3" />
          <div className="flex justify-between text-xl font-bold"><span>Total:</span><span style={{color: theme.primary}}>Rs. {grand.toLocaleString('en-IN',{minimumFractionDigits:2})}</span></div>
        </div>
        <div className="text-center mb-6"><h3 className="font-semibold mb-4">Scan QR Code to Pay</h3><div className="bg-white rounded-xl shadow-lg inline-block p-4"><img src={QR_URL} alt="QR" className="w-64 h-auto mx-auto rounded-lg" /></div><p className="text-sm text-gray-500 mt-3">Pay via PhonePe / UPI</p></div>
        <div className="space-y-4"><div><Label className="text-base font-medium">Transaction ID</Label><Input placeholder="Enter transaction ID" value={txnId} onChange={e => setTxnId(e.target.value)} className="mt-1 h-11" /></div><Button className="w-full h-12 text-lg text-white" style={{background: theme.buttonBg}} onClick={handlePay} disabled={loading}>{loading ? 'Processing...' : 'Confirm Order'}</Button></div>
      </CardContent></Card>
    </div>
  )
}

// ========== ORDERS ==========
function OrdersPage({ token, setCurrentPage, theme }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { api.get('/orders', token).then(setOrders).catch(console.error).finally(() => setLoading(false)) }, [token])
  const statusColor = (s) => s === 'Confirmed' ? {bg:'#dcfce7',color:'#166534'} : s === 'Pending' ? {bg:'#fef9c3',color:'#854d0e'} : {bg:'#f3f4f6',color:'#374151'}
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Package className="h-6 w-6" style={{color: theme.primary}} />My Orders</h1>
      {loading ? <p className="text-center py-12">Loading...</p> : orders.length === 0 ? <Card className="text-center py-12"><CardContent><Package className="h-16 w-16 mx-auto text-gray-300 mb-4" /><p className="text-gray-500 mb-4">No orders yet</p><Button onClick={() => setCurrentPage('home')} className="text-white" style={{background: theme.buttonBg}}>Start Shopping</Button></CardContent></Card> : (
        <div className="space-y-4">{orders.map(order => (
          <Card key={order.id}><CardHeader className="pb-3"><div className="flex flex-wrap items-center justify-between gap-2"><div><CardTitle className="text-base">Order #{order.id.slice(0,8)}</CardTitle><CardDescription>{new Date(order.created_at).toLocaleDateString('en-IN',{year:'numeric',month:'long',day:'numeric'})}</CardDescription></div><Badge style={{background: statusColor(order.status).bg, color: statusColor(order.status).color}}>{order.status}</Badge></div></CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1 mb-3">{order.products?.map((p,i) => <div key={i} className="flex justify-between text-sm"><span>{p.product_name} x {p.quantity}</span><span>Rs. {(p.price*p.quantity).toLocaleString('en-IN')}</span></div>)}</div>
            <Separator className="my-2" /><div className="flex justify-between font-bold"><span>Total</span><span style={{color: theme.primary}}>Rs. {order.total_price?.toLocaleString('en-IN',{minimumFractionDigits:2})}</span></div>
            <p className="text-xs text-gray-500 mt-2">Txn: {order.transaction_id}</p>
          </CardContent></Card>
        ))}</div>
      )}
    </div>
  )
}

// ========== ADMIN LOGIN ==========
function AdminLoginPage({ setCurrentPage, onLogin, theme }) {
  const [step, setStep] = useState(1)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [otpHint, setOtpHint] = useState('')
  const [loading, setLoading] = useState(false)
  const loginAdmin = async () => { setLoading(true); try { const d = await api.post('/admin/login', { username, password }); setOtpHint(d.otp_hint||''); toast.success('OTP sent!'); setStep(2) } catch (e) { toast.error(e.message) } setLoading(false) }
  const verifyOtp = async () => { setLoading(true); try { const d = await api.post('/admin/verify-otp', { otp }); onLogin(d.token, d.user); toast.success('Admin login successful!'); setCurrentPage('admin') } catch (e) { toast.error(e.message) } setLoading(false) }
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md animate-fadeIn">
        <CardHeader className="text-center"><Shield className="h-12 w-12 mx-auto mb-2" style={{color: theme.primary}} /><CardTitle>Admin Panel</CardTitle><CardDescription>Step {step}: {step===1?'Credentials':'OTP'}</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          {step===1 && <><div><Label>Username</Label><Input value={username} onChange={e=>setUsername(e.target.value)} /></div><div><Label>Password</Label><Input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div><Button className="w-full text-white" style={{background: theme.buttonBg}} onClick={loginAdmin} disabled={loading}>{loading?'...':'Continue'}</Button></>}
          {step===2 && <>{otpHint && <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm"><AlertCircle className="inline h-4 w-4 mr-1" />OTP: <strong>{otpHint}</strong></div>}<div><Label>OTP</Label><Input value={otp} onChange={e=>setOtp(e.target.value)} /></div><Button className="w-full text-white" style={{background: theme.buttonBg}} onClick={verifyOtp} disabled={loading}>{loading?'...':'Verify & Login'}</Button></>}
          <Button variant="ghost" className="w-full" onClick={()=>setCurrentPage('landing')}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
        </CardContent>
      </Card>
    </div>
  )
}

// ========== ADMIN DASHBOARD ==========
function AdminDashboard({ token, theme }) {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [categories, setCategories] = useState([])
  const [activeTab, setActiveTab] = useState('products')
  const [editProduct, setEditProduct] = useState(null)
  const [np, setNp] = useState({ name:'', price:'', description:'', category:'', brand:'afn_graphics', image_url:'' })
  const [newCat, setNewCat] = useState('')
  const [newCatBrand, setNewCatBrand] = useState('afn_graphics')
  const [adminBrand, setAdminBrand] = useState('afn_graphics')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const [p, o, c] = await Promise.all([api.get('/products', token), api.get('/admin/orders', token), api.get('/categories', token)])
      setProducts(p); setOrders(o); setCategories(c)
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [token])
  useEffect(() => { loadData() }, [loadData])

  const uploadImage = async (file) => {
    setUploading(true)
    try {
      const sig = await api.get('/cloudinary/signature', token)
      const fd = new FormData(); fd.append('file', file); fd.append('api_key', sig.api_key); fd.append('timestamp', sig.timestamp); fd.append('signature', sig.signature); fd.append('folder', sig.folder)
      const r = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`, { method: 'POST', body: fd })
      const d = await r.json(); return d.secure_url || ''
    } catch { toast.error('Upload failed'); return '' }
    finally { setUploading(false) }
  }

  const handleImg = async (e, isEdit) => {
    const f = e.target.files?.[0]; if (!f) return
    const url = await uploadImage(f)
    if (url) { if (isEdit) setEditProduct(p => ({...p, image_url: url})); else setNp(p => ({...p, image_url: url})); toast.success('Uploaded!') }
  }

  const addProd = async () => { try { await api.post('/products', np, token); setNp({name:'',price:'',description:'',category:'',brand:adminBrand,image_url:''}); toast.success('Added!'); loadData() } catch(e){ toast.error(e.message) } }
  const updateProd = async () => { try { await api.put(`/products/${editProduct.id}`, editProduct, token); setEditProduct(null); toast.success('Updated!'); loadData() } catch(e){ toast.error(e.message) } }
  const delProd = async (id) => { if(!confirm('Delete?')) return; try { await api.del(`/products/${id}`, token); toast.success('Deleted!'); loadData() } catch(e){ toast.error(e.message) } }
  const updateOrder = async (id, status) => { try { await api.put(`/orders/${id}`, {status}, token); toast.success('Updated!'); loadData() } catch(e){ toast.error(e.message) } }
  const addCat = async () => { if(!newCat.trim()) return; try { await api.post('/categories', {name: newCat, brand: newCatBrand}, token); setNewCat(''); toast.success('Added!'); loadData() } catch(e){ toast.error(e.message) } }
  const delCat = async (id) => { if(!confirm('Delete?')) return; try { await api.del(`/categories/${id}`, token); toast.success('Deleted!'); loadData() } catch(e){ toast.error(e.message) } }

  const filteredProducts = products.filter(p => p.brand === adminBrand)
  const filteredCats = categories.filter(c => c.brand === adminBrand)
  const abTheme = BRAND_CONFIG[adminBrand]

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2"><LayoutDashboard className="h-6 w-6" style={{color: theme.primary}} />Admin Dashboard</h1>
        <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
          <button className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${adminBrand==='afn_graphics' ? 'text-white shadow' : 'text-gray-600'}`} style={adminBrand==='afn_graphics'?{background:'#e91e8c'}:{}} onClick={() => { setAdminBrand('afn_graphics'); setNp(p=>({...p, brand:'afn_graphics'})) }}>
            <img src={AFN_LOGO} className="inline h-5 w-5 rounded mr-1 object-contain" style={{background:'#000'}} />AFN</button>
          <button className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${adminBrand==='crazzy_gifts' ? 'text-white shadow' : 'text-gray-600'}`} style={adminBrand==='crazzy_gifts'?{background:'#0d9488'}:{}} onClick={() => { setAdminBrand('crazzy_gifts'); setNp(p=>({...p, brand:'crazzy_gifts'})) }}>
            <img src={CRAZZY_LOGO} className="inline h-5 w-5 rounded mr-1 object-contain" style={{background:'#000'}} />Crazzy</button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-md"><TabsTrigger value="products">Products ({filteredProducts.length})</TabsTrigger><TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger><TabsTrigger value="categories">Categories ({filteredCats.length})</TabsTrigger></TabsList>

        <TabsContent value="products" className="mt-6">
          <Card className="mb-6"><CardHeader><CardTitle className="text-lg">{editProduct?'Edit':'Add'} Product <span className="text-sm font-normal" style={{color: abTheme.primary}}>({abTheme.name})</span></CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Name</Label><Input value={editProduct?editProduct.name:np.name} onChange={e=>editProduct?setEditProduct({...editProduct,name:e.target.value}):setNp({...np,name:e.target.value})} /></div>
              <div><Label>Price (Rs.)</Label><Input type="number" value={editProduct?editProduct.price:np.price} onChange={e=>editProduct?setEditProduct({...editProduct,price:e.target.value}):setNp({...np,price:e.target.value})} /></div>
              <div className="md:col-span-2"><Label>Description</Label><Input value={editProduct?editProduct.description:np.description} onChange={e=>editProduct?setEditProduct({...editProduct,description:e.target.value}):setNp({...np,description:e.target.value})} /></div>
              <div><Label>Category</Label><select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={editProduct?editProduct.category:np.category} onChange={e=>editProduct?setEditProduct({...editProduct,category:e.target.value}):setNp({...np,category:e.target.value})}><option value="">Select</option>{filteredCats.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}</select></div>
              <div><Label>Image</Label><Input type="file" accept="image/*" onChange={e=>handleImg(e,!!editProduct)} />{uploading&&<p className="text-sm mt-1" style={{color:abTheme.primary}}>Uploading...</p>}{(editProduct?.image_url||np.image_url)&&<img src={editProduct?.image_url||np.image_url} alt="" className="mt-2 h-20 w-20 object-cover rounded" />}</div>
            </div>
            <div className="flex gap-2 mt-4">
              {editProduct ? <><Button className="text-white" style={{background:abTheme.buttonBg}} onClick={updateProd}>Update</Button><Button variant="outline" onClick={()=>setEditProduct(null)}>Cancel</Button></> : <Button className="text-white" style={{background:abTheme.buttonBg}} onClick={addProd} disabled={!np.name}>Add Product</Button>}
            </div>
          </CardContent></Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{filteredProducts.map(p=>(
            <Card key={p.id} className="overflow-hidden"><div className="h-40 bg-gray-100"><img src={p.image_url||'https://via.placeholder.com/300'} alt={p.name} className="w-full h-full object-cover" /></div>
            <CardContent className="p-3"><h3 className="font-semibold text-sm">{p.name}</h3><p className="text-sm font-medium" style={{color:abTheme.primary}}>Rs. {p.price?.toLocaleString('en-IN')}</p><Badge variant="outline" className="text-xs mt-1">{p.category}</Badge>
            <div className="flex gap-2 mt-3"><Button variant="outline" size="sm" onClick={()=>setEditProduct({...p})}><Edit className="h-3 w-3 mr-1" />Edit</Button><Button variant="outline" size="sm" className="text-red-500" onClick={()=>delProd(p.id)}><Trash2 className="h-3 w-3 mr-1" />Delete</Button></div></CardContent></Card>
          ))}</div>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          {orders.length===0?<p className="text-center text-gray-500 py-8">No orders</p>:
          <div className="space-y-4">{orders.map(o=>(
            <Card key={o.id}><CardContent className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3"><div><p className="font-semibold">Order #{o.id.slice(0,8)}</p><p className="text-sm text-gray-500">{o.user_name} | <a href={`https://wa.me/91${o.user_phone?.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline inline-flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />{o.user_phone}</a></p><p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleString('en-IN')}</p></div>
              <select className="h-9 rounded-md border px-3 text-sm" value={o.status} onChange={e=>updateOrder(o.id,e.target.value)}><option>Pending</option><option>Confirmed</option><option>Processing</option><option>Delivered</option><option>Cancelled</option></select></div>
              <div className="text-sm space-y-1">{o.products?.map((p,i)=><div key={i} className="flex justify-between"><span>{p.product_name} x{p.quantity}</span><span>Rs. {(p.price*p.quantity).toLocaleString('en-IN')}</span></div>)}</div>
              <Separator className="my-2" /><div className="flex justify-between font-bold text-sm"><span>Total:</span><span>Rs. {o.total_price?.toLocaleString('en-IN',{minimumFractionDigits:2})}</span></div><p className="text-xs text-gray-400 mt-1">Txn: {o.transaction_id}</p>
            </CardContent></Card>
          ))}</div>}
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <Card className="mb-6"><CardContent className="p-4"><div className="flex gap-2 flex-wrap">
            <select className="h-10 rounded-md border px-3 text-sm" value={newCatBrand} onChange={e=>setNewCatBrand(e.target.value)}><option value="afn_graphics">AFN Graphics</option><option value="crazzy_gifts">Crazzy Gifts</option></select>
            <Input placeholder="New category name" value={newCat} onChange={e=>setNewCat(e.target.value)} className="flex-1 min-w-[200px]" />
            <Button className="text-white" style={{background:abTheme.buttonBg}} onClick={addCat}><Plus className="h-4 w-4 mr-1" />Add</Button>
          </div></CardContent></Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">{filteredCats.map(c=>(
            <Card key={c.id}><CardContent className="p-4 flex items-center justify-between">
              <span className="font-medium">{c.name}</span>
              <Button variant="ghost" size="sm" className="text-red-500" onClick={()=>delCat(c.id)}><Trash2 className="h-4 w-4" /></Button>
            </CardContent></Card>
          ))}</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ========== ABOUT ==========
function AboutPage({ theme }) {
  return (
    <div className="animate-fadeIn">
      <div className="py-16" style={{background: theme.heroBg}}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-6 mb-6">
            <img src={AFN_LOGO} alt="AFN" className="h-20 w-20 rounded-2xl shadow-2xl object-contain" style={{background:'#000'}} />
            <img src={CRAZZY_LOGO} alt="Crazzy" className="h-20 w-20 rounded-2xl shadow-2xl object-contain" style={{background:'#000'}} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">About Us</h1>
          <p style={{color: theme.accent}}>Two brands, One vision of excellence</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-2" style={{borderColor: 'rgba(233,30,140,0.2)'}}><CardContent className="p-6 text-center">
            <img src={AFN_LOGO} alt="AFN" className="h-24 w-24 mx-auto mb-4 rounded-xl object-contain" style={{background:'#000'}} />
            <h2 className="text-2xl font-bold mb-2" style={{color:'#e91e8c'}}>AFN Graphics</h2>
            <p className="text-purple-600 mb-4">A Unique Designing Solutions</p>
            <p className="text-gray-600 text-sm">Professional graphic design and printing services. From logos to brochures, we create stunning designs that elevate your brand.</p>
          </CardContent></Card>
          <Card className="border-2" style={{borderColor: 'rgba(45,212,191,0.2)'}}><CardContent className="p-6 text-center">
            <img src={CRAZZY_LOGO} alt="Crazzy" className="h-24 w-24 mx-auto mb-4 rounded-xl object-contain" style={{background:'#000'}} />
            <h2 className="text-2xl font-bold mb-2" style={{color:'#2dd4bf'}}>Crazzy Gifts World</h2>
            <p className="text-teal-600 mb-4">A Complete Online Gift Solutions</p>
            <p className="text-gray-600 text-sm">Personalized gifts for every occasion. Custom mugs, t-shirts, photo frames, and more. Make every gift extraordinary!</p>
          </CardContent></Card>
        </div>
        <Card><CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-4" style={{color: theme.primary}}>Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 rounded-xl" style={{background: theme.lightBg}}><Star className="h-8 w-8 mx-auto mb-2" style={{color: theme.primary}} /><h3 className="font-semibold">Premium Quality</h3><p className="text-sm text-gray-600">Top-notch design & print</p></div>
            <div className="text-center p-4 rounded-xl" style={{background: theme.lightBg}}><Clock className="h-8 w-8 mx-auto mb-2" style={{color: theme.primary}} /><h3 className="font-semibold">Fast Delivery</h3><p className="text-sm text-gray-600">Quick turnaround</p></div>
            <div className="text-center p-4 rounded-xl" style={{background: theme.lightBg}}><Heart className="h-8 w-8 mx-auto mb-2" style={{color: theme.primary}} /><h3 className="font-semibold">Customer First</h3><p className="text-sm text-gray-600">100% satisfaction</p></div>
          </div>
          <div className="rounded-2xl p-8 text-center text-white" style={{background: theme.heroBg}}>
            <p className="text-2xl font-bold italic mb-2" style={{color: theme.primary}}>{theme.quote}</p>
            <p style={{color: theme.accent}}>{theme.quote2}</p>
          </div>
        </CardContent></Card>
      </div>
    </div>
  )
}

// ========== CONTACT ==========
function ContactPage({ theme }) {
  return (
    <div className="animate-fadeIn">
      <div className="py-16" style={{background: theme.heroBg}}><div className="max-w-4xl mx-auto px-4 text-center"><h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1><p style={{color: theme.accent}}>We'd love to hear from you</p></div></div>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card><CardContent className="p-8 space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-xl" style={{background: theme.lightBg}}><div className="rounded-full p-3" style={{background: theme.buttonBg}}><Phone className="h-6 w-6 text-white" /></div><div><h3 className="font-semibold text-lg">Phone / WhatsApp</h3><p className="font-medium text-lg" style={{color: theme.primary}}>{PHONE_NO}</p></div></div>
          <div className="flex items-center gap-4 p-4 rounded-xl" style={{background: theme.lightBg}}><div className="rounded-full p-3" style={{background: theme.secondary}}><Mail className="h-6 w-6 text-white" /></div><div><h3 className="font-semibold text-lg">Email</h3><p className="font-medium" style={{color: theme.primary}}>afngraphics7867@gmail.com</p></div></div>
          <div className="rounded-2xl p-8 text-center" style={{background: theme.heroBg}}>
            <div className="flex items-center justify-center gap-4 mb-4"><img src={AFN_LOGO} alt="AFN" className="h-12 w-12 rounded-xl object-contain" style={{background:'#000'}} /><img src={CRAZZY_LOGO} alt="Crazzy" className="h-12 w-12 rounded-xl object-contain" style={{background:'#000'}} /></div>
            <p className="text-white font-bold text-xl mb-2">AFN GRAPHICS & Crazzy Gifts World</p>
            <p className="italic" style={{color: theme.accent}}>{theme.quote}</p>
          </div>
        </CardContent></Card>
      </div>
    </div>
  )
}

// ========== MAIN APP ==========
function App() {
  const [activeBrand, setActiveBrand] = useState(null)
  const [currentPage, setCurrentPage] = useState('brand-select')
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [cart, setCart] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('individual')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [seeded, setSeeded] = useState(false)

  const theme = BRAND_CONFIG[activeBrand] || BRAND_CONFIG.afn_graphics

  // Load saved state
  useEffect(() => {
    const savedToken = localStorage.getItem('afn_token')
    const savedUser = localStorage.getItem('afn_user')
    const savedBrand = localStorage.getItem('afn_brand')
    if (savedBrand) { setActiveBrand(savedBrand); setCurrentPage('landing') }
    if (savedToken && savedUser) {
      setToken(savedToken); setUser(JSON.parse(savedUser))
      setCurrentPage('home')
    }
  }, [])

  // Seed DB
  useEffect(() => {
    if (!seeded) { api.post('/seed', {}).then(() => setSeeded(true)).catch(() => setSeeded(true)) }
  }, [seeded])

  // Load products & categories for current brand
  useEffect(() => {
    if (!activeBrand || !seeded) return
    const load = async () => {
      try {
        const [p, c] = await Promise.all([
          api.get(`/products?brand=${activeBrand}`),
          api.get(`/categories?brand=${activeBrand}`)
        ])
        setProducts(p); setCategories(c)
      } catch (e) { console.error(e) }
    }
    load()
  }, [activeBrand, seeded])

  // Load cart
  useEffect(() => {
    if (token && user?.role !== 'admin') api.get('/cart', token).then(setCart).catch(console.error)
  }, [token, user])

  const onBrandSelect = (brand) => {
    setActiveBrand(brand)
    localStorage.setItem('afn_brand', brand)
    setSelectedCategory('all')
    setSearchQuery('')
    setCurrentPage('landing')
  }

  const onLogin = (t, u) => {
    setToken(t); setUser(u)
    localStorage.setItem('afn_token', t)
    localStorage.setItem('afn_user', JSON.stringify(u))
    setCurrentPage(u.role === 'admin' ? 'admin' : 'home')
  }

  const onLogout = () => {
    setToken(null); setUser(null); setCart([])
    localStorage.removeItem('afn_token'); localStorage.removeItem('afn_user')
    setCurrentPage('landing')
    toast.success('Logged out')
  }

  const onAddToCart = async (pid) => {
    if (!token) { setCurrentPage('login'); return }
    try { const items = await api.post('/cart', { product_id: pid, quantity: 1 }, token); setCart(items); toast.success('Added to cart!') } catch (e) { toast.error(e.message) }
  }
  const onUpdateCart = async (id, qty) => { try { const items = await api.put(`/cart/${id}`, { quantity: qty }, token); setCart(items) } catch (e) { toast.error(e.message) } }
  const onRemoveFromCart = async (id) => { try { const items = await api.del(`/cart/${id}`, token); setCart(items); toast.success('Removed') } catch (e) { toast.error(e.message) } }

  useEffect(() => {
    if (currentPage === 'product-detail' && window.__selectedProduct) { setSelectedProduct(window.__selectedProduct); window.__selectedProduct = null }
  }, [currentPage])

  // Brand selector screen
  if (!activeBrand || currentPage === 'brand-select') {
    return (<><Toaster position="top-right" richColors /><BrandSelector onSelect={onBrandSelect} /></>)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'landing': return <LandingPage products={products} categories={categories} setCurrentPage={setCurrentPage} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} theme={theme} activeBrand={activeBrand} />
      case 'login': return <LoginPage setCurrentPage={setCurrentPage} onLogin={onLogin} theme={theme} />
      case 'register': return <RegisterPage setCurrentPage={setCurrentPage} onLogin={onLogin} theme={theme} />
      case 'forgot-password': return <ForgotPasswordPage setCurrentPage={setCurrentPage} theme={theme} />
      case 'home': return <HomePage products={products} categories={categories} user={user} token={token} setCurrentPage={setCurrentPage} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} onAddToCart={onAddToCart} viewMode={viewMode} setViewMode={setViewMode} theme={theme} activeBrand={activeBrand} />
      case 'product-detail': return <ProductDetailPage product={selectedProduct} user={user} viewMode={viewMode} setCurrentPage={setCurrentPage} onAddToCart={onAddToCart} theme={theme} />
      case 'cart': return <CartPage cart={cart} setCurrentPage={setCurrentPage} onUpdateCart={onUpdateCart} onRemoveFromCart={onRemoveFromCart} theme={theme} />
      case 'payment': return <PaymentPage cart={cart} token={token} setCurrentPage={setCurrentPage} setCart={setCart} theme={theme} />
      case 'orders': return <OrdersPage token={token} setCurrentPage={setCurrentPage} theme={theme} />
      case 'admin-login': return <AdminLoginPage setCurrentPage={setCurrentPage} onLogin={onLogin} theme={theme} />
      case 'admin': return user?.role === 'admin' ? <AdminDashboard token={token} theme={theme} /> : <LoginPage setCurrentPage={setCurrentPage} onLogin={onLogin} theme={theme} />
      case 'about': return <AboutPage theme={theme} />
      case 'contact': return <ContactPage theme={theme} />
      default: return <LandingPage products={products} categories={categories} setCurrentPage={setCurrentPage} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} theme={theme} activeBrand={activeBrand} />
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" richColors />
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} cart={cart} onLogout={onLogout} activeBrand={activeBrand} setActiveBrand={onBrandSelect} theme={theme} />
      {renderPage()}
      <Footer setCurrentPage={setCurrentPage} theme={theme} activeBrand={activeBrand} />
    </div>
  )
}

export default App