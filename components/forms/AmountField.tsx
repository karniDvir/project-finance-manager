
'use client'

interface AmountFieldProps {
    value: string,
    onValueChange: (val: string) => void
}

export function AmountField ({value, onValueChange} : AmountFieldProps){
    return(
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Amount <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
              $
            </span>
            <input
              type="number"
              value={value}
              onChange={(e) => onValueChange(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full bg-white/5 border border-white/20 text-white placeholder-slate-400 pl-8 pr-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors duration-200"
              required
            />
          </div>
        </div>
    )
}