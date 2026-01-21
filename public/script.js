const { useState } = React;

const App = () => {
  const [isPremium, setIsPremium] = useState(false);

  const handleUpgrade = async (email) => {
    const res = await fetch('/create-subscription', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (data.subscriptionId) setIsPremium(true);
  };

  return (
    <div>
      <h1>CreatorHub</h1>
      <p>Your all-in-one creator tool</p>
      {!isPremium && <button onClick={() => handleUpgrade('your@email.com')}>Upgrade to Premium</button>}
      {/* Add chat, AI tools, etc. components here */}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
