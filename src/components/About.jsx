import React from 'react';

export default function About() {
  return (
    <div className="about-wrapper">
      <svg className="about-cloud-svg" viewBox="0 0 340 380" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M60 340 C20 340 5 318 10 296 C0 280 -2 254 18 238 C8 218 12 196 30 184 C22 164 30 144 50 136 C44 116 54 98 74 92 C72 72 84 54 106 50 C110 30 128 16 150 18 C160 6 180 0 200 6 C218 -2 240 2 254 16 C268 8 288 12 298 28 C312 22 328 32 332 50 C344 56 348 74 340 90 C350 104 348 122 336 134 C344 150 340 168 326 178 C332 194 326 212 312 222 C318 238 312 256 296 266 C302 282 296 300 280 310 C286 326 276 340 258 340 Z"
          stroke="#6dacec"
          strokeWidth="2.5"
          fill="none"
          strokeLinejoin="round"
        />
      </svg>
      <div className="about-text-inner">
        <p className="about-text">
          I created my Happy Box when I was in college. I was going through a rough time and felt lost. Small things in my day brought me a lot of joy, and I wanted to take note of these things to still be grateful for my life. I used to write down these little notes of daily joys on post its, fold them up, and drop them into an empty kleenex box with a snowman themed design. I didn't realize that what I was doing was the gratitude practice. Soon there were too many post its in my kleenex box, so I moved to documenting these notes in my notes app on my iPhone. I've done this since 2015, accumulating happy moments in my life for the last 10+ years. Now, this little practice helps me innately look for the joy in literally everything. And I love that ◡̈
        </p>
      </div>
    </div>
  );
}
