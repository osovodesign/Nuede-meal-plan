import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon' | 'reverse';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  className = '',
  size = 'md',
}) => {
  // Height presets
  const heightMap = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-12',
    xl: 'h-16',
  };

  const isReverse = variant === 'reverse';
  const textColor = isReverse ? '#FFFFFF' : '#096E21';

  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${heightMap[size]} w-auto inline-block ${className}`}
        aria-label="Nuede Logo Mark"
      >
        {/* Left leaf */}
        <path
          d="M 45 42 C 40 28 32 20 22 22 C 20 32 30 42 45 42 Z"
          fill="#096E21"
        />
        <path
          d="M 28 27 Q 35 34 44 41"
          stroke="#07581a"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Right leaf */}
        <path
          d="M 46 42 C 50 24 62 14 74 16 C 76 28 64 39 46 42 Z"
          fill="#096E21"
        />
        <path
          d="M 52 35 Q 63 26 71 20"
          stroke="#07581a"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Bowl container */}
        <path
          d="M 12 42 L 88 42 C 86 64 68 76 50 76 C 32 76 14 64 12 42 Z"
          fill="#FEF2A3"
          stroke="#096E21"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Bowl base foot */}
        <path
          d="M 38 76 L 62 76 C 60 80 56 81 50 81 C 44 81 40 80 38 76 Z"
          fill="#FEF2A3"
          stroke="#096E21"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Full Wordmark "nuede"
  return (
    <svg
      viewBox="0 0 340 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${heightMap[size]} w-auto inline-block ${className}`}
      aria-label="nuede"
    >
      {/* Letter 'n' */}
      <g fill={textColor}>
        <path
          d="M 28 44 C 28 38 31 32 36 29 C 40 27 46 29 47 34 C 52 28 60 25 68 25 C 80 25 87 33 87 46 L 87 72 C 87 75 85 77 81 77 C 77 77 75 75 75 72 L 75 49 C 75 41 71 36 64 36 C 56 36 50 42 50 51 L 50 72 C 50 75 48 77 44 77 C 40 77 38 75 38 72 L 38 52 C 38 46 36 43 32 44 C 30 45 28 47 28 44 Z"
        />
      </g>

      {/* Letter 'u' as the signature bowl & leaves */}
      <g transform="translate(86, 12)">
        {/* Left leaf */}
        <path
          d="M 40 38 C 35 25 28 17 18 19 C 16 28 26 38 40 38 Z"
          fill="#096E21"
        />
        <path
          d="M 24 23 Q 31 30 39 37"
          stroke={isReverse ? '#FFFFFF' : '#07581a'}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Right leaf */}
        <path
          d="M 41 38 C 45 21 57 11 68 13 C 70 24 59 35 41 38 Z"
          fill="#096E21"
        />
        <path
          d="M 47 31 Q 58 22 65 17"
          stroke={isReverse ? '#FFFFFF' : '#07581a'}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Bowl */}
        <path
          d="M 8 38 L 82 38 C 80 58 64 70 45 70 C 26 70 10 58 8 38 Z"
          fill="#FEF2A3"
          stroke="#096E21"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Bowl base */}
        <path
          d="M 34 70 L 56 70 C 54 74 51 75 45 75 C 39 75 36 74 34 70 Z"
          fill="#FEF2A3"
          stroke="#096E21"
          strokeWidth="2.5"
        />
      </g>

      {/* Letters 'ede' */}
      <g fill={textColor}>
        {/* First 'e' */}
        <path
          d="M 194 53 C 194 39 203 28 217 28 C 230 28 238 38 238 52 C 238 54 236 55 233 55 L 183 55 C 184 65 192 72 203 72 C 210 72 216 69 219 65 C 221 63 223 62 225 63 C 227 64 227 67 225 69 C 220 75 212 78 203 78 C 187 78 174 67 174 52 C 174 41 183 29 198 28 C 213 27 226 37 226 51 C 226 52 225 53 224 53 Z M 216 34 C 206 34 199 41 197 49 L 226 49 C 225 41 221 34 216 34 Z"
        />

        {/* Letter 'd' */}
        <path
          d="M 273 14 L 273 40 C 268 33 260 28 249 28 C 234 28 222 41 222 56 C 222 71 234 83 249 83 C 260 83 268 78 273 71 L 273 73 C 273 76 275 78 279 78 C 283 78 285 76 285 73 L 285 14 C 285 11 283 9 279 9 C 275 9 273 11 273 14 Z M 254 72 C 243 72 234 64 234 54 C 234 44 243 36 254 36 C 265 36 274 44 274 54 C 274 64 265 72 254 72 Z"
        />

        {/* Second 'e' */}
        <path
          d="M 307 53 C 307 39 316 28 330 28 C 343 28 351 38 351 52 C 351 54 349 55 346 55 L 296 55 C 297 65 305 72 316 72 C 323 72 329 69 332 65 C 334 63 336 62 338 63 C 340 64 340 67 338 69 C 333 75 325 78 316 78 C 300 78 287 67 287 52 C 287 41 296 29 311 28 C 326 27 339 37 339 51 C 339 52 338 53 337 53 Z M 329 34 C 319 34 312 41 310 49 L 339 49 C 338 41 334 34 329 34 Z"
        />
      </g>
    </svg>
  );
};
