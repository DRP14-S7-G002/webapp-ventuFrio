import Image from 'next/image';
import style from './style.module.css';
import imgCenter from '../../assets/img-center.png';
export default function Header() {

  return (
    <>
    <div className={style.main_header}>
       <Image src={imgCenter} alt="imagem centro" className={style.imagem_header} priority />
    </div>
    </>
  );
}

