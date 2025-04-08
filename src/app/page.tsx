import Home from "./home/page";
import styles from "./page.module.css";

export default function Page() {
  return (
    <div className={styles.main_style}>
      <Home/>
    </div>
  );
}
