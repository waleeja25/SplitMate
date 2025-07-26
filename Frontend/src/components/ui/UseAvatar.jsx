import Avatar from 'boring-avatars';

const variants = ['beam', 'marble', 'pixel', 'sunset', 'bauhaus', 'ring'];

function getVariant(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash += name.charCodeAt(i);
  }
  return variants[hash % variants.length];
}

export default function UserAvatar({ name, size = 40 }) {
  const variant = getVariant(name); 
  return (
    <Avatar
      size={size}
      name={name}
      variant={variant}
      square={false}
    />
  );
}
