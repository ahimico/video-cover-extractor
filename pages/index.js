import Link from "next/link";
import styles from "./main.module.css";

const Test = () => {
  return (
    <>
      <p>Test</p>
    </>
  );
};

export default function IndexPage() {
  return (
    <div className={styles.test}>
      Hello World.2
      <Test />
      <Link href="/about">
        <a>About</a>
      </Link>
    </div>
  );
}
