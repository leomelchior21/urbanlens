import { Hotspot } from '@/store/useCrisisStore';

export type HotspotImportance = 'low' | 'medium' | 'high';

const SIMPLE_WORD_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\banomal(?:y|ies|ous)\b/gi, 'unusual sign'],
  [/\binfrastructure\b/gi, 'city system'],
  [/\bmunicipal\b/gi, 'city'],
  [/\blocalized\b/gi, 'nearby'],
  [/\bthreshold\b/gi, 'safe limit'],
  [/\bexceed(?:s|ed|ing)?\b/gi, 'goes above'],
  [/\bsaturation\b/gi, 'too much water in the ground'],
  [/\bsubstation\b/gi, 'power station'],
  [/\btelemetry\b/gi, 'sensor data'],
  [/\bparticulate\b/gi, 'tiny smoke and dust'],
  [/\bPM2\.5\b/gi, 'tiny smoke particles'],
  [/\bleachate\b/gi, 'dirty landfill liquid'],
  [/\bbenzene\b/gi, 'dangerous chemical gas'],
  [/\babstraction\b/gi, 'water stealing'],
  [/\bthermal inversion\b/gi, 'air layer trapping pollution'],
  [/\balbedo\b/gi, 'how much heat the ground absorbs'],
  [/\bcanopy\b/gi, 'tree cover'],
  [/\bgrid\b/gi, 'power network'],
  [/\bSCADA\b/gi, 'automatic power control'],
  [/\bGPR\b/gi, 'underground radar'],
  [/\beffluent\b/gi, 'dirty water'],
  [/\bvector\b/gi, 'mosquito spread'],
  [/\brespiratory\b/gi, 'breathing'],
  [/\bcontamination\b/gi, 'dirty or unsafe water'],
];

export function getHotspotImportance(hotspot: Hotspot): HotspotImportance {
  if (hotspot.investigativeRole === 'root_clue' || hotspot.investigativeRole === 'symptom') {
    return 'high';
  }

  if (hotspot.investigativeRole === 'secondary_clue') {
    return 'medium';
  }

  if (hotspot.investigativeRole === 'distractor' || hotspot.investigativeRole === 'false_lead') {
    return 'low';
  }

  if (hotspot.type === 'false_lead' || hotspot.type === 'social') {
    return 'low';
  }

  if (hotspot.type === 'alert' || hotspot.type === 'hint' || hotspot.type === 'internal_email') {
    return 'medium';
  }

  return 'medium';
}

export function getHotspotImportanceLabel(importance: HotspotImportance) {
  switch (importance) {
    case 'high':
      return 'Key clue';
    case 'medium':
      return 'Useful clue';
    default:
      return 'Low priority';
  }
}

export function simplifyHotspotDescription(hotspot: Hotspot) {
  let text = hotspot.description
    .replace(/@\w+:\s*/g, 'Resident report: ')
    .replace(/\bFWD:\s*/gi, '')
    .replace(/\bPROCON:\s*/gi, 'Complaint: ')
    .replace(/\bSYSTEM ALERT:\s*/gi, 'System warning: ')
    .replace(/\bCRITICAL ALERT:\s*/gi, 'Critical warning: ')
    .replace(/\bBREAKING:\s*/gi, 'News: ')
    .replace(/\s+/g, ' ')
    .trim();

  SIMPLE_WORD_REPLACEMENTS.forEach(([pattern, replacement]) => {
    text = text.replace(pattern, replacement);
  });

  if (text.length > 210) {
    text = `${text.slice(0, 207).trimEnd()}...`;
  }

  return text;
}
