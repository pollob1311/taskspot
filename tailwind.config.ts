import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom Antigravity Palette
        void: '#050505',
        'card-dark': '#0a0a0a',
        neon: {
          purple: '#8b5cf6',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          pink: '#f472b6',
        },
        // Legacy/Light mode support (keeping for safety)
        light: {
          primary: '#667eea',
          secondary: '#f093fb',
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          background: '#f9fafb',
          card: '#ffffff',
          text: '#111827',
          muted: '#6b7280',
        },
        dark: {
          primary: '#818cf8',
          secondary: '#f472b6',
          success: '#34d399',
          warning: '#fbbf24',
          danger: '#f87171',
          background: '#050505', // Updated to Void
          card: '#0a0a0a',        // Updated to Card Dark
          text: '#f9fafb',
          muted: '#9ca3af',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-success': 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(102, 126, 234, 0.4)',
        'glow-lg': '0 0 40px rgba(102, 126, 234, 0.6)',
        'neon-purple': '0 0 10px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)',
        'neon-blue': '0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'color-cycle': 'colorCycle 3s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        colorCycle: {
          '0%, 100%': { color: '#8b5cf6' }, // neon-purple
          '33%': { color: '#3b82f6' },      // neon-blue
          '66%': { color: '#06b6d4' },      // neon-cyan
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
