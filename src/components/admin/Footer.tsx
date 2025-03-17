import flareyeLogo from '@/public/flareye/flareye-tm-sites.png';
import Image from 'next/image';
import React from 'react';
import styles from '@/styles/admin/Footer.module.scss';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <span>Powered by</span>
      <Image src={flareyeLogo} alt="Flareye Logo" width={80} height={30} />
    </footer>
  );
};

export default Footer;