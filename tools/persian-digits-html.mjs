// Render user-visible Latin numerals as Persian glyphs, preserving source code,
// URLs, HTML attributes, metadata, structured data and machine-readable dates.
export const persianDigits = value => String(value).replace(/[0-9]/g, digit => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);

const protectedBlock = /<!--[\s\S]*?-->|<(script|style|noscript|textarea|pre|code|svg|math)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;
const tag = /<(?:[^<>"']|"[^"]*"|'[^']*')*>/g;

function convertVisibleText(segment) {
  let output = "", pos = 0;
  for (const match of segment.matchAll(tag)) {
    output += persianDigits(segment.slice(pos, match.index));
    output += match[0]; // Not a visible text node; never change HTML attributes.
    pos = match.index + match[0].length;
  }
  return output + persianDigits(segment.slice(pos));
}

export function persianizeHTML(html) {
  let output = "", pos = 0;
  const input = String(html);
  for (const match of input.matchAll(protectedBlock)) {
    output += convertVisibleText(input.slice(pos, match.index));
    output += match[0]; // Never touch scripts, styles, comments or preformatted code.
    pos = match.index + match[0].length;
  }
  return output + convertVisibleText(input.slice(pos));
}
