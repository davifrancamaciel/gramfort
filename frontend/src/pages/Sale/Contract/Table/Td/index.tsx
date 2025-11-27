const Td = ({ title, value, children, styleTd, colSpan, prefixValue }: any) => (
  <td
    colSpan={colSpan ? colSpan : '1'}
    style={{
      border: '#eee solid 1px',
      fontSize: '12px',
      verticalAlign: 'center',
      padding: '4px 12px',
      ...styleTd
    }}
  >
    {children ? (
      children
    ) : (
      <TdItem title={title} value={value} prefixValue={prefixValue} />
    )}
  </td>
);

const TdItem = ({ title, value, prefixValue }: any) => (
  <div>
    <strong>{title}</strong>
    <span style={{ marginLeft: '5px' }}>
      <strong>{prefixValue}</strong>
      {value}
    </span>
  </div>
);

export default Td;
