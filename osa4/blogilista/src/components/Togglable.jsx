import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef(({ buttonLabel, children }, ref) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(prevVisible => !prevVisible)
  }

  useImperativeHandle(ref, () => ({
    toggleVisibility
  }))

  return (
    <div>
      {!visible && (
        <button onClick={toggleVisibility} aria-label="Show content">
          {buttonLabel}
        </button>
      )}
      {visible && (
        <div>
          {children}
          <button onClick={toggleVisibility} aria-label="Hide content">
            Cancel
          </button>
        </div>
      )}
    </div>
  )
})

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.node
}

export default Togglable
