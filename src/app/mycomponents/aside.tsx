"use client"
import Image from 'next/image';
import { IonIcon } from '@ionic/react'; 
import { FC } from 'react';

const Sidebar: FC = () => {
  return (
    <aside className="sidebar" data-sidebar>

      <div className="sidebar-info">

        <figure className="avatar-box">
          <Image 
            src="/assets/images/my-avatar.png" 
            alt="Richard Hanrick" 
            width={80} 
            height={80} 
          />
        </figure>

        <div className="info-content">
          <h1 className="name" title="Richard Hanrick">Richard Hanrick</h1>
          <p className="title">Web developer</p>
        </div>

        <button className="info_more-btn" data-sidebar-btn>
          <span>Show Contacts</span>
          <IonIcon name="chevron-down" />
        </button>

      </div>

      <div className="sidebar-info_more">

        <div className="separator"></div>

        <ul className="contacts-list">

          <li className="contact-item">
            <div className="icon-box">
              <IonIcon name="mail-outline" />
            </div>
            <div className="contact-info">
              <p className="contact-title">Email</p>
              <a href="mailto:richard@example.com" className="contact-link">richard@example.com</a>
            </div>
          </li>

          <li className="contact-item">
            <div className="icon-box">
              <IonIcon name="phone-portrait-outline" />
            </div>
            <div className="contact-info">
              <p className="contact-title">Phone</p>
              <a href="tel:+12133522795" className="contact-link">+1 (213) 352-2795</a>
            </div>
          </li>

          <li className="contact-item">
            <div className="icon-box">
              <IonIcon name="calendar-outline" />
            </div>
            <div className="contact-info">
              <p className="contact-title">Birthday</p>
              <time dateTime="1982-06-23">June 23, 1982</time>
            </div>
          </li>

          <li className="contact-item">
            <div className="icon-box">
              <IonIcon name="location-outline" />
            </div>
            <div className="contact-info">
              <p className="contact-title">Location</p>
              <address>Sacramento, California, USA</address>
            </div>
          </li>

        </ul>

        <div className="separator"></div>

        <ul className="social-list">

          <li className="social-item">
            <a href="#" className="social-link">
              <IonIcon name="logo-facebook" />
            </a>
          </li>

          <li className="social-item">
            <a href="#" className="social-link">
              <IonIcon name="logo-twitter" />
            </a>
          </li>

          <li className="social-item">
            <a href="#" className="social-link">
              <IonIcon name="logo-instagram" />
            </a>
          </li>

        </ul>

      </div>

    </aside>
  );
};

export default Sidebar;
