import React from 'react'


interface Props {
    checked: boolean
    onChange: (v: boolean) => void
    label?: string
}


export default React.memo(function Toggle({ checked, onChange, label }: Props) {
    return (
        <label className="inline-flex items-center gap-2">
            <input
                type="checkbox"
                checked={checked}
                onChange={e => onChange(e.target.checked)}
                className="form-checkbox h-5 w-5 text-indigo-600"
            />
            <span>{label}</span>
        </label>
    )
})