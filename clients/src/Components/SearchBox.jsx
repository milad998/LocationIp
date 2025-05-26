export default function SearchBox({ searchTerm, setSearchTerm, searchSuggestions }) {
  return (
    <div className="mb-3 position-relative">
      <label className="form-label">بحث في النتائج</label>
      <input
        className="form-control"
        type="text"
        placeholder="ابحث عن IP أو اسم لتغيير 🔴 إلى 🟢"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchSuggestions.length > 0 && (
        <ul className="list-group position-absolute w-100 z-3" style={{ top: '100%', left: 0 }}>
          {searchSuggestions.map((s, idx) => (
            <li
              key={idx}
              style={{ cursor: 'pointer' }}
              className="list-group-item"
              onClick={() => {
                const parts = searchTerm.trim().split(/\s+/);
                parts.pop();
                parts.push(s);
                setSearchTerm(parts.join(' ') + ' ');
              }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
