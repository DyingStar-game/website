'use client';

import { motion } from 'framer-motion';
import { Rocket, Github, Twitter, Disc as Discord, Youtube } from 'lucide-react';

const footerLinks = {
  'Jeu': [
    { name: 'Télécharger (Soon)', href: '#', disabled: true },
    { name: 'Configuration Requise (Soon)', href: '#', disabled: true },
    { name: 'Notes de Version (Soon)', href: '#', disabled: true },
    { name: 'Roadmap', href: '/roadmap' }
  ],
  'Communauté': [
    { name: 'Discord', href: 'https://discord.gg/BJxmmQ9xf5' },
    { name: 'Forums (Soon)', href: '#', disabled: true },
    { name: 'Github', href: 'https://github.com/DyingStar-game' },
    { name: 'Wiki (Soon)', href: '#', disabled: true }
  ],
  'Support': [
    { name: 'Centre d\'aide (Soon)', href: '#', disabled: true },
    { name: 'Signaler un Bug (Soon)', href: '#', disabled: true },
    { name: 'Contact (Soon)', href: '#', disabled: true },
    { name: 'FAQ (Soon)', href: '#', disabled: true }
  ],
  'Légal': [
    { name: 'Conditions d\'utilisation (Soon)', href: '#', disabled: true },
    { name: 'Politique de confidentialité (Soon)', href: '#', disabled: true },
    { name: 'Cookies (Soon)', href: '#', disabled: true },
    { name: 'RGPD (Soon)', href: '#', disabled: true }
  ]
};

const socialLinks = [
  { icon: Discord, href: '#', label: 'Discord' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Github, href: 'https://github.com/DyingStar-game', label: 'GitHub' }
];

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <motion.div
              className="flex items-center space-x-2 mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Rocket className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold text-white">Dying Star</span>
            </motion.div>
            <motion.p
              className="text-gray-400 mb-6 max-w-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Dying Star est un projet de jeu MMO spatial immersif open source, mené par la communauté.
              Inspiré des space operas, il offre une alternative indépendante aux grands titres du genre, conçue par et pour les passionnés.
            </motion.p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + categoryIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => {
                  const isObject = typeof link === 'object';
                  const linkName = isObject ? link.name : link;
                  const linkHref = isObject ? link.href : '#';
                  const isDisabled = isObject ? link.disabled : false;
                  
                  return (
                  <li key={linkName}>
                    <a
                      href={linkHref}
                      className={`transition-colors duration-300 ${
                        isDisabled 
                          ? 'text-gray-600 cursor-not-allowed' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                      onClick={isDisabled ? (e) => e.preventDefault() : undefined}
                    >
                      {linkName}
                    </a>
                  </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 Dying Star. Tous droits réservés.
          </p>
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <span>Version Bêta 0.0.0</span>
            <span>•</span>
            <span>Serveurs: Maintenance</span>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}