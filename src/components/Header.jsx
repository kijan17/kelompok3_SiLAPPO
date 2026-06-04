// src/components/Header.jsx
const Header = () => {
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
      <div className="text-sm text-gray-500 font-medium">
        {today}
      </div>
    </header>
  );
};

export default Header;