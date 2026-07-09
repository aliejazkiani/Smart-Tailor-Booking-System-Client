import React from 'react';

// A labeled schematic explaining where each measurement is taken from, plus a
// plain-language definition for each term. The silhouette and callout points
// both change per category so women's (bust/hips/neckline) and child's
// (smaller frame) terms land on a body shape that actually matches them,
// instead of reusing the men's shirt-and-trouser outline for everyone.
const MEASUREMENT_INFO = {
  neck: 'Around the base of the neck, where the collar sits.',
  shoulder: 'Across the back, from one shoulder edge to the other.',
  chest: 'Around the fullest part of the chest, under the arms.',
  bust: 'Around the fullest part of the bust.',
  sleeves: 'From the shoulder seam down to the desired wrist/cuff point.',
  shirtLength: 'From the collar down to where the shirt should end.',
  waist: 'Around the natural waistline (narrowest part of the torso).',
  hips: 'Around the fullest part of the hips.',
  neckDesign: 'Style/shape of the neckline (e.g. V-shape, round, boat-neck).',
  trouserLength: 'From the waist down to the desired hem/ankle point.',
  bottom: 'Width of the trouser leg opening at the hem/ankle.',
  age: "Child's age — used to guide standard size estimation.",
};

const SILHOUETTES = {
  // Shirt torso + sleeves, splitting into two trouser legs.
  men: {
    viewBox: '0 0 300 400',
    body: 'M118,60 L150,45 L182,60 L205,62 L232,150 L206,158 L196,110 L196,220 L204,222 L188,372 L162,372 L156,222 L144,222 L138,372 L112,372 L96,222 L104,220 L104,110 L94,158 L68,150 L95,62 Z',
    neck: { cx: 150, cy: 55, r: 10 },
  },
  // Same shoulders/sleeves, but a fitted bodice flaring into a single
  // A-line skirt hem instead of trouser legs.
  women: {
    viewBox: '0 0 300 400',
    body: 'M118,60 L150,45 L182,60 L205,62 L232,150 L206,158 L194,108 L192,200 L224,340 L76,340 L108,200 L106,108 L94,158 L68,150 L95,62 Z',
    neck: { cx: 150, cy: 55, r: 10 },
  },
  // Same proportions as men's, scaled down and shifted up for a shorter frame.
  child: {
    viewBox: '0 0 300 340',
    body: 'M126,72 L150,62 L174,72 L192,74 L211,140 L190,146 L182,112 L182,196 L188,198 L176,296 L156,296 L150,198 L142,198 L136,296 L116,296 L104,198 L110,196 L110,112 L102,146 L81,140 L100,74 Z',
    neck: { cx: 150, cy: 68, r: 9 },
  },
};

const CATEGORY_CALLOUTS = {
  men: [
    { field: 'neck', label: 'Neck', x: 150, y: 38, lineTo: { x: 150, y: 55 } },
    { field: 'shoulder', label: 'Shoulder', x: 245, y: 60, lineTo: { x: 205, y: 62 } },
    { field: 'chest', label: 'Chest', x: 250, y: 108, lineTo: { x: 210, y: 108 } },
    { field: 'sleeves', label: 'Sleeve Length', x: 258, y: 165, lineTo: { x: 232, y: 150 } },
    { field: 'shirtLength', label: 'Shirt Length', x: 42, y: 130, lineTo: { x: 118, y: 130 } },
    { field: 'waist', label: 'Waist', x: 250, y: 222, lineTo: { x: 205, y: 222 } },
    { field: 'trouserLength', label: 'Trouser Length', x: 42, y: 300, lineTo: { x: 128, y: 300 } },
    { field: 'bottom', label: 'Bottom Width', x: 150, y: 388, lineTo: { x: 150, y: 372 } },
  ],
  women: [
    { field: 'neckDesign', label: 'Neckline', x: 150, y: 30, lineTo: { x: 150, y: 50 } },
    { field: 'shoulder', label: 'Shoulder', x: 245, y: 60, lineTo: { x: 205, y: 62 } },
    { field: 'bust', label: 'Bust', x: 250, y: 106, lineTo: { x: 208, y: 106 } },
    { field: 'sleeves', label: 'Sleeve Length', x: 258, y: 165, lineTo: { x: 232, y: 150 } },
    { field: 'shirtLength', label: 'Shirt Length', x: 42, y: 130, lineTo: { x: 118, y: 130 } },
    { field: 'waist', label: 'Waist', x: 250, y: 202, lineTo: { x: 200, y: 202 } },
    { field: 'hips', label: 'Hips', x: 250, y: 260, lineTo: { x: 218, y: 260 } },
    { field: 'trouserLength', label: 'Length', x: 42, y: 300, lineTo: { x: 90, y: 300 } },
  ],
  child: [
    { field: 'shoulder', label: 'Shoulder', x: 235, y: 68, lineTo: { x: 198, y: 72 } },
    { field: 'chest', label: 'Chest', x: 235, y: 112, lineTo: { x: 197, y: 112 } },
    { field: 'sleeves', label: 'Sleeve Length', x: 242, y: 140, lineTo: { x: 212, y: 128 } },
    { field: 'shirtLength', label: 'Shirt Length', x: 50, y: 120, lineTo: { x: 108, y: 120 } },
    { field: 'waist', label: 'Waist', x: 235, y: 197, lineTo: { x: 192, y: 197 } },
    { field: 'trouserLength', label: 'Trouser Length', x: 50, y: 250, lineTo: { x: 112, y: 250 } },
    { field: 'bottom', label: 'Bottom Width', x: 150, y: 315, lineTo: { x: 150, y: 296 } },
  ],
};

const MeasurementGuideDiagram = ({ fields = [], category = 'men' }) => {
  const normalizedCategory = CATEGORY_CALLOUTS[category] ? category : 'men';
  const callouts = CATEGORY_CALLOUTS[normalizedCategory];
  const silhouette = SILHOUETTES[normalizedCategory];

  const activeFields = fields.length
    ? callouts.filter((c) => fields.includes(c.field))
    : callouts;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-xl font-bold mb-1 text-gray-800">Measurement Guide — What Each Term Means</h2>
      <p className="text-sm text-slate-400 mb-6">Every point on your size card, shown on the body and explained below.</p>

      {/* Full-width picture on top, showing every measurement point at once */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
        <svg viewBox={silhouette.viewBox} className="w-full max-w-sm mx-auto" role="img" aria-label={`${normalizedCategory} body measurement diagram`}>
          <path
            d={silhouette.body}
            fill="#f0e8d8"
            stroke="#c9a15f"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Neck opening */}
          <circle cx={silhouette.neck.cx} cy={silhouette.neck.cy} r={silhouette.neck.r} fill="#fffdf8" stroke="#c9a15f" strokeWidth="2" />

          {/* Dashed guide lines + callouts */}
          {activeFields.map((c) => (
            <g key={c.field}>
              <line
                x1={c.lineTo.x} y1={c.lineTo.y} x2={c.x} y2={c.y}
                stroke="#a67c3d" strokeWidth="1" strokeDasharray="3,3"
              />
              <circle cx={c.lineTo.x} cy={c.lineTo.y} r="3" fill="#8f6c2f" />
              <text
                x={c.x} y={c.y}
                textAnchor={c.x > 150 ? 'start' : c.x < 150 ? 'end' : 'middle'}
                fontSize="11"
                fontWeight="700"
                fill="#6b4f21"
              >
                {c.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Table below the picture explaining every term */}
      <div className="overflow-x-auto mt-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-widest">
              <th className="px-4 py-3 border-b">Measurement</th>
              <th className="px-4 py-3 border-b">Where To Measure</th>
            </tr>
          </thead>
          <tbody>
            {activeFields.map((c) => (
              <tr key={c.field} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-4 py-3 font-bold text-slate-800 whitespace-nowrap">{c.label}</td>
                <td className="px-4 py-3 text-slate-500 text-sm">{MEASUREMENT_INFO[c.field]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MeasurementGuideDiagram;
