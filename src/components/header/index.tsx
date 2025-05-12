import Image from 'next/image';
import style from './style.module.css';

export default function Header() {
  return (
    <div className={style.main_header}>
      <Image
        src="/img-center.png"
        alt="Banner VentuFrio"
        className={style.imagem_header}
        width={1000}
        height={200}
        priority
      />
    </div>
  );
}