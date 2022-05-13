type Props = {
  onChange: (newTextInput: string) => void
  placeholder?: string
  defaultRows?: number
}

const IMTextArea = ({ onChange, placeholder = '', defaultRows = 4 }: Props) => {
  const handleChange = (event) => {
    // Dynamically resize height of textarea as user types
    event.target.style.height = 'inherit'
    event.target.style.height = `${event.target.scrollHeight}px`

    onChange(event.target.value)
  }

  return (
    <textarea
      rows={defaultRows}
      className="px-4 py-3 w-full leading-tight overflow-hidden border border-black/[.1] rounded-lg appearance-none focus:outline-none bg-black/[.02] focus:bg-white dark:focus:bg-gray-700 placeholder:text-black/[.5]"
      onChange={handleChange}
      placeholder={placeholder}
    />
  )
}

export default IMTextArea
