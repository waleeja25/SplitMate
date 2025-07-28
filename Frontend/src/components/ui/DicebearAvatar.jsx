import React from 'react';

/**
 * DicebearAvatar
 * @param {string} name - Group name (used as seed for avatar)
 * @param {number} size - Size in pixels (default: 40)
 * @param {boolean} square - Whether the avatar is square (default: false)
 * @param {string} style - DiceBear style (default: 'shapes')
 * @param {string} backgroundColor - Optional background color (hex without #)
 */
export default function DicebearAvatar({
  name = 'Group',
  size = 40,
  square = false,
  style = 'shapes',
  backgroundColor = 'e6fcf8',
}) {
  const encodedName = encodeURIComponent(name);
  const avatarUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${encodedName}&radius=50&backgroundColor=${backgroundColor}`;

  return (
    <img
      src={avatarUrl}
      alt={`Avatar for ${name}`}
      width={size}
      height={size}
      className={`${square ? '' : 'rounded-full'} object-cover`}
    />
  );
}
