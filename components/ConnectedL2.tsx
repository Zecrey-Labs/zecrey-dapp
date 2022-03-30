import { FormEvent, useMemo, useState } from "react";
import styles from "../styles/Home.module.css";

const ConnectedL2 = (props: { accountName: string }) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h3 style={{ margin: 0 }}>
          Wallet address: <code>{props.accountName}</code>
        </h3>
        <div className="columns">
          <Transfer accountName={props.accountName} />
        </div>
      </main>
    </div>
  );
};
export default ConnectedL2;

const Transfer = (props: { accountName: string }) => {
  const [to, setTo] = useState("gavin");
  const [value, setValue] = useState("0.0001");
  const [loading, setLoading] = useState(false);
  const disabled = useMemo(() => {
    return !to || !value || loading;
  }, [to, value, loading]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const zecrey = (window as any).zecrey;
    if (zecrey) {
      try {
        setLoading(true);
        let val = await zecrey.request({
          method: "zecrey_L2_sendTransaction",
          params: {
            action: 4, // transfer
            from: props.accountName, // zecrey account name
            gasFeeAssetId: 0,
            args: {
              assetId: 0,
              payees: [{ address: to, amount: value }],
              memo: "",
            },
          },
        });
        console.log(val);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    } else {
      window.open(
        "https://chrome.google.com/webstore/detail/zecrey/ojbpcbinjmochkhelkflddfnmcceomdi"
      );
    }
  };

  return (
    <form onSubmit={submit}>
      <h2 className={styles.title}>Transfer REY</h2>
      <label>To</label>
      <div>
        <input type="text" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      <label>Amount</label>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <br />
      <input
        type="submit"
        disabled={disabled}
        value={loading ? "Transfer..." : "Transfer"}
      />
    </form>
  );
};
