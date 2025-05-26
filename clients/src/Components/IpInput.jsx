export default function IpInput({
  ips,
  setIps,
  suggestions,
  containerRef,
  inputRef,
  onClear,
  onSuggestionClick,
  onChange
}) {
  return (
    <div className="mb-3 position-relative" ref={containerRef}>
      <label className="form-label">أدخل عناوين IP مفصولة بمسافات أو كلمات</label>
      <div className="position-relative">
        <input
          className="form-control"
          type="text"
          placeholder="اكتب جزء من الاسم أو IP وسيظهر اقتراح"
          value={ips}
          onChange={onChange}
          ref={inputRef}
        />
        {ips && (
          <X
            size={18}
            className="position-absolute top-0 end-0 mt-2 me-2 text-danger"
            style={{ cursor: 'pointer' }}
            onClick={onClear}
          />
        )}
      </div>
      {suggestions.length > 0 && (
        <ul className="list-group position-absolute w-100 z-3" style={{ top: '100%', left: 0 }}>
          {suggestions.map((entry, idx) => (
            <li
              key={idx}
              style={{ cursor: 'pointer' }}
              className="list-group-item d-flex justify-content-between"
              onClick={() => onSuggestionClick(entry.ip)}
            >
              <span>{entry.name}</span>
              <span className="text-muted small">{entry.ip}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
