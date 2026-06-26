import { useState } from 'react';

const emptyAddress = {
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  phoneNumber: '',
};

const fields = [
  { name: 'firstName', label: 'First name', autoComplete: 'given-name' },
  { name: 'lastName', label: 'Last name', autoComplete: 'family-name' },
  { name: 'address', label: 'Street address', autoComplete: 'shipping street-address', full: true, multiline: true },
  { name: 'city', label: 'City', autoComplete: 'shipping address-level2' },
  { name: 'state', label: 'State / Province', autoComplete: 'shipping address-level1' },
  { name: 'zip', label: 'ZIP / Postal code', autoComplete: 'shipping postal-code' },
  { name: 'phoneNumber', label: 'Phone number', autoComplete: 'tel' },
];

const DeliveryAddressForm = ({ onSubmit, submitting = false }) => {
  const [address, setAddress] = useState(emptyAddress);

  const updateField = (name, value) => {
    setAddress((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(address);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Delivery address</h2>
        <p className="mt-1 text-sm text-gray-500">This address will be saved on the order.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <label key={field.name} className={field.full ? 'sm:col-span-2' : ''}>
            <span className="mb-1 block text-sm font-medium text-gray-700">{field.label}</span>
            {field.multiline ? (
              <textarea
                required
                rows={3}
                name={field.name}
                autoComplete={field.autoComplete}
                value={address[field.name]}
                onChange={(event) => updateField(field.name, event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            ) : (
              <input
                required
                type="text"
                name={field.name}
                autoComplete={field.autoComplete}
                value={address[field.name]}
                onChange={(event) => updateField(field.name, event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            )}
          </label>
        ))}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? 'Saving address...' : 'Continue to payment'}
      </button>
    </form>
  );
};

export default DeliveryAddressForm;