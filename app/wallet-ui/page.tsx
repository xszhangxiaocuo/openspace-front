
export default function WalletUI() {
  return (
    <div>
      <h1>Wallet UI</h1>
      <p>Welcome to wallet UI!</p>
      {/* @ts-expect-error msg */}
      <appkit-connect-button />
    </div>
  );
}