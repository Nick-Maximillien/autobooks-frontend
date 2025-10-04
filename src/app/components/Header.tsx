'use client';
import Link from 'next/link';
import Image from 'next/image'; 
import { useState } from 'react';

export default function Header() {
  const [dropDownOpen, setDropDownOpen] = useState(false);

  return (
    <header className="header">
      <div className="row headerContainer header">
        <div className="head">
          <div className="logo">
            <Image
              className="logoImg"
              src="/images/logo.png"
              alt="logo"
              width={150}
              height={70}
              priority
            />
          </div>

          {/* Existing dropdown nav */}
          <nav className="nav dropdown-nav">
            <ul className="theMenu">
              <li
                className="dropdown-container"
                onMouseEnter={() => setDropDownOpen(true)}
                onMouseLeave={() => setDropDownOpen(false)}
              >
                <figure className="menu">
                  <Image
                    className="dropbtn menuIcon"
                    src="/images/menu.png"
                    alt="Menu"
                    width={35}
                    height={35}
                  />
                </figure>
                {dropDownOpen && (
                  <ul className="dropdown-list">
                    <li className="menuItem"><Link href="/">Home</Link></li>
                    <li className="menuItem"><Link href="/services">Services</Link></li>
                    <li className="menuItem"><Link href="/shopper_dashboard">Business dashboard</Link></li>
                    <li className="menuItem"><Link href="/web">Web Business assistant</Link></li>
                    <li className="menuItem"><Link href="/whatsapp">Whatsapp Business assistant</Link></li>
                    <li className="menuItem"><Link href="/contact">Contact</Link></li>
                    <li className="menuItem"><Link href="/defi_sign_up">defi</Link></li>
                  </ul>
                )}
              </li>
            </ul>
          </nav>

          {/* Inline nav for landscape */}
          <nav className="nav inline-nav">
            <ul className="inlineMenu">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/shopper_dashboard">Business dashboard</Link></li>
              <li><Link href="/web">Web Business assistant</Link></li>
              <li><Link href="/whatsapp">Whatsapp Business assistant</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li className="menuItem"><Link href="/defi_sign_up">defi</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
