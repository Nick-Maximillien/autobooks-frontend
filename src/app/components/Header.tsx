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
          <nav className="nav">
            <ul>
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
                    <li className="menuItem">
                      <Link href="/">Home</Link>
                    </li>
                    <li className="menuItem">
                      <Link href="/services">Services</Link>
                    </li>
                    <li className="menuItem">
                      <Link href="/shopper_dashboard">Shopper</Link>
                    </li>
                    <li className="menuItem">
                      <Link href="/merchant_dashboard">Retailer</Link>
                    </li>
                    <li className="menuItem">
                      <Link href="/manufacturer_dashboard">Supplier</Link>
                    </li>
                    <li className="menuItem">
                      <Link href="/web">Web Shop assistant</Link>
                    </li>
                    <li className="menuItem">
                      <Link href="/whatsapp">Whatsapp Shop assistant</Link>
                    </li>
                    <li className="menuItem">
                      <Link href="/team">Team</Link>
                    </li>
                    <li className="menuItem">
                      <Link href="/observer">Observer</Link>
                    </li>
                    <li className="menuItem">
                      <Link href="/contact">Contact</Link>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
