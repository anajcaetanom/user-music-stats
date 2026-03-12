export const HomeButton = ({ resetValues }) => {
  return (
    <div className="center" style={{ marginTop: '1vh' }}>
      <button onClick={resetValues}>Go Home</button>
    </div>
  );
};
