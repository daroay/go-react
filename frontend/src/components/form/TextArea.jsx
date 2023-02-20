const TextArea = (props) => {
  return (
    <div class="mb-3">
      <label htmlFor={props.name} className="form-label">
        {props.title}
      </label>
      <textarea
        className="form-control"
        id={props.name}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        rows={props.rows}
      />
      <div className={props.errorDiv}>{props.errorMessage}</div>
    </div>
  )
}

export default TextArea