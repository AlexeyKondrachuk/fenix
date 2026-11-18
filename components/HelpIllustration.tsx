const scenes = {
  adults: <>
    <path className="wash" d="M0 112C60 69 91 145 157 120s105-76 163-88v108H0Z" />
    <path className="line" d="M24 140c17-24 26-58 50-91M46 99l-9-26m18 10 20-12" />
    <path className="leaf" d="M38 87C22 76 23 59 26 53c12 6 16 19 12 34Zm18-4c8-13 20-17 31-15-6 12-17 16-31 15Zm9-21c1-14 8-26 21-31-1 15-9 27-21 31ZM42 109c11-12 25-16 38-11-8 10-23 15-38 11Z" />
    <path className="ink" d="M114 122c0-15 25-22 63-23 46-1 82 7 81 23-1 13-25 18-73 18-44 0-71-6-71-18Z" />
    <path className="paper" d="M130 94c1-13 28-23 60-23 30 0 55 9 54 21-1 12-23 17-53 17-35 0-62-5-61-15Z" />
    <path className="warm" d="M149 63c-1-11 16-21 40-22 23-1 42 7 42 18 0 11-18 16-41 17-23 1-40-3-41-13Z" />
  </>,
  children: <>
    <path className="wash" d="M0 125c42-44 93-48 142-17 41 26 106-7 178-63v95H0Z" />
    <path className="warm" d="M132 40 180 4l48 36Z" />
    <path className="leaf" d="M151 40h58v45h-58Z" />
    <path className="ink" d="M111 85h138v55h-46v-15a23 23 0 0 0-46 0v15h-46Z" />
    <path className="warm" d="M61 115h39v25H61Z" />
    <path className="paper" d="M252 109a17 17 0 0 1 34 0Z" />
  </>,
  parents: <>
    <path className="wash" d="M0 112C61 65 102 125 164 108c58-16 103-68 156-76v108H0Z" />
    <path className="warm" d="M13 140c9-30 32-45 64-44 17 0 29 7 44 13l24-20 10 8-27 29c-6 6-19 3-35-2l6 16Z" />
    <path className="paper" d="M54 57c14-16 41-11 48 8l8 14-10 4c-1 12-13 20-22 17l-3 10-23-9 9-16Z" />
    <path className="ink" d="M103 64c-7 7-20 9-35 7 4 10 1 18-6 24-17 9-37-3-31-17-16-16 4-32 17-28 20-23 50-19 55 14Z" />
    <path className="leaf" d="M198 140c8-31 25-49 60-48 33 0 49 15 62 48Z" />
    <path className="paper" d="M271 45c-15-15-42-12-50 10l-8 15 10 4c2 11 11 17 21 16l3 14 24-13-7-15Z" />
    <path className="ink" d="M218 56c12 5 24 3 34 0-2 11 4 21 13 25 17-10 24-26 11-40-9-11-27-12-39-9-14 3-23 14-19 24Z" />
    <path className="line" d="M140 65c7-13 21-18 37-13m-31 25c10-5 18-5 27-3" />
  </>,
};

export default function HelpIllustration({ scene, className }: {
  scene: keyof typeof scenes;
  className: string;
}) {
  return (
    <svg className={className} viewBox="0 0 320 140" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      {scenes[scene]}
    </svg>
  );
}
