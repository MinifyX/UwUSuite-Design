const WORD_JOINER = "⁠";
const NBSP = " ";

/**
 * A kaomoji is one picture, not words: "(っ˘ω˘ς)" must never break in the middle, and it stays on
 * the line of the word before it. A face is a bracketed run of up to 16 characters without spaces,
 * Latin letters or digits, so "(meist 7000)" and "(2)" stay as they are. Apply it to playful
 * strings when they are loaded (docs/tone.md).
 */
export function keepKaomojiTogether(text: string) {
  return text.replace(
    /(\s?)([(（][^()（）\s\p{Script=Latin}\p{Nd}]{1,16}[)）])/gu,
    (_match, space: string, face: string) => {
      return (space ? NBSP : "") + [...face].join(WORD_JOINER);
    },
  );
}
