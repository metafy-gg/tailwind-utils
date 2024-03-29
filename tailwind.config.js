// const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'aot',
  purge: {
    content: [
      './src/**/*.{html,svelte}',
      './src/lib/**/*.js',
      './src/routes/**/*.js',
    ],
    options: {
      defaultExtractor: (content) => [
        ...(content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []),
        ...(content.match(/[^<>"'`\s.(){}[\]#=%]*[^<>"'`\s.(){}[\]#=%:]/g) ||
          []),
        ...(content.match(/(?<=class:)[^=>\/\s]*/g) || []),
      ],
    },
  },
  theme: {
    fontFamily: {
      sans: ['Graphik Web'],
    },
    fontSize: {
      xxs: '0.625rem',
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      xl: '1.25rem',
      '1.5xl': '1.5rem',
      '2xl': '1.625rem',
      '3xl': '1.75rem',
      '3.25xl': '2rem',
      '3.5xl': '2.5rem',
      '4xl': '2.625rem',
      '5xl': '4.5rem',
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        md: '2rem',
      },
    },
    extend: {
      screens: {
        xs: { max: '639px' },
      },
      colors: {
        black: '#0f0f0f',
        neutrals: {
          d00: '#21252A',
          d10: '#181a1e',
          d20: '#1A1E23',
          d30: '#030404',
          d40: '#1B2025',
          d50: '#272C32',
          d60: '#21242A',
          d70: '#0D0F10',
          d80: '#262A33',
          l00: '#ffffff',
          l10: '#ebecf0',
          l20: '#9ea0a5',
          l30: '#8293A4',
          l40: '#798694',
          l50: '#8E949A',
        },
        functional: {
          r00: '#eb4646',
          r10: '#DB3A3A',
          r20: '#be3434',
          r30: '#BA2B2B',
          r40: '#D83F3F',
          r50: '#F14343',
          r60: '#D63E3E',
          r70: '#BE3333',
          y00: '#fec403',
          y10: '#ffab00',
          y20: '#EE6B0D',
          y30: '#FAC640',
          g00: '#41C699',
          g10: '#00875a',
          // FIXME: g20: '#21C66D',
          g20: '#17CA69',
          g30: '#239F5C',
          g40: '#17CA69',
          g50: '#21C66D',
          b00: '#91b7c3',
          b10: '#7DC1F4',
          b20: '#233945',
        },
        extended: {
          b00: '#1991eb',
          b10: '#1665d8',
          p00: '#675bf3',
        },
        brands: {
          metafy: '#B82F36',
          discord: '#7289DA',
          twitch: '#673AB7',
          google: '#EA4335',
          paypal: '#0070BA',
          twitter: '#03A9F4',
          facebook: '#1976D2',
          youtube: '#FF0000',
          dribbble: '#EA4C89',
          instagram: '#E1306C',
          apple: '#000000',
        },
      },
      boxShadow: {
        xs: '0px 3px 2px rgba(23, 43, 77, 0.08), 0px 0px 2px rgba(23, 43, 77, 0.04)',
        sm: '0px 5px 3px rgba(0, 0, 0, 0.08), 0px 3px 2px rgba(0, 0, 0, 0.04)',
        default:
          '0px 8px 5px rgba(0, 0, 0, 0.08), 0px 5px 3px rgba(0, 0, 0, 0.04)',
        md: '0px 15px 12px rgba(0, 0, 0, 0.08), 0px 8px 5px rgba(0, 0, 0, 0.04)',
        lg: '0px 24px 18px rgba(0, 0, 0, 0.08), 0px 18px 12px rgba(0, 0, 0, 0.04)',
        xl: '0px 35px 24px rgba(0, 0, 0, 0.08), 0px 24px 18px rgba(0, 0, 0, 0.04)',
      },
      opacity: {
        8: '.08',
        15: '.15',
        20: '.20',
        40: '.40',
        35: '.35',
        60: '.60',
        65: '.65',
        80: '.80',
        85: '.85',
        90: '.90',
        97: '.97',
      },
      spacing: {
        3.25: '0.8125rem',
        4.5: '1.125rem',
        5.5: '1.375rem',
        6.5: '1.625rem',
        7.5: '1.875rem',
        8.5: '2.125rem',
        9.5: '2.375rem',
        11.5: '2.875rem',
        12.5: '3.125rem',
        18: '4.5rem',
        38: '9.5rem',
        47: '11.75rem',
        53.5: '13.375rem',
        68: '17rem',
        76: '19rem',
        82: '20.5rem',
        84: '21rem',
        90: '22.5rem',
        100: '25rem',
        120: '30rem',
        144: '36rem',
        150: '37.5rem',
        '1/5': '20%',
        '9/16': '56.25%',
        '3/5': '60%',
        '3/4': '75%',
      },
      letterSpacing: {
        '-0.01': '-0.01em',
        '-0.005': '-0.005em',
        0.01: '0.01em',
        0.02: '0.02em',
        0.04: '0.04em',
        0.08: '0.08em',
        0.1: '0.1em',
        0.12: '0.12em',
      },
      borderRadius: {
        xl: '0.625rem', // or 10px
        '2xl': '0.75rem', // or 12px
        '3xl': '1rem', // or 16px
      },
      inset: {
        '1/2': '50%',
        100: '100%',
      },
      zIndex: {
        '-1': '-1',
        1: '1',
        'guest-navbar': 5,
        60: 60,
        sidebar: 41,
        'lower-modal-backdrop': 48,
        'lower-modal': 49,
        'modal-backdrop': 50,
        modal: 60,
        'higher-modal-backdrop': 61,
        'higher-modal': 62,
        dropdown: 100,
        loader: 9999,
        toast: 10000,
      },
      transitionDuration: {
        400: '0.4s',
        1500: '1.5s',
        2000: '2s',
      },
      maxWidth: {
        screen: '100vw',
        14: '3.5rem',
        235: '58.75rem',
        '1/2': '50%',
      },
      minHeight: {
        164: '41rem',
      },
      minWidth: (theme) => ({
        24: theme('spacing.24'),
      }),
      scale: {
        175: '1.75',
      },
      backgroundImage: {
        card: 'linear-gradient(269.77deg, rgba(48, 82, 107, 0.32) 0%, rgba(40, 63, 84, 0.32) 100%)',
      },
      transitionProperty: {
        spacing: 'margin, padding', // To avoid using -all
      },
      borderWidth: {
        3: '3px',
        5: '5px',
      },
      blur: {
        '1.5xl': '32px',
      },
    },
  },
};
