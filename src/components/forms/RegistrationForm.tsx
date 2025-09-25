import React, { useState } from 'react';
import QRCode from 'qrcode';

type YearLevel = '1st Year' | '2nd Year' | '3rd Year' | '4th Year';

interface FormData {
  studentId: string;
  name: string;
  section: string;
  yearLevel: YearLevel;
  course: 'BSCS' | 'BSIT' | string;
  email: string;
}

interface FormErrors {
  studentId?: string;
  name?: string;
  section?: string;
  yearLevel?: string;
  course?: string;
  email?: string;
}

export const RegistrationForm: React.FC = () => {
  const [form, setForm] = useState<FormData>({
    studentId: '20-21001',
    name: 'John Doe',
    section: 'A',
    yearLevel: '3rd Year',
    course: 'BSCS',
    email: 'student@gbox.ncf.edu.ph',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const allowedDomains = ['@gbox.ncf.edu.ph', '@ncf.edu.ph'];

  const validate = (data: FormData): FormErrors => {
    const e: FormErrors = {};
    // Student ID format: 00-00000
    if (!/^\d{2}-\d{5}$/.test(data.studentId)) {
      e.studentId = 'Student ID must match format 00-00000';
    }
    if (!data.name.trim()) e.name = 'Name is required';
    if (!/^[A-Z]$/.test(data.section)) e.section = 'Section must be a single capital letter';
    if (!data.yearLevel) e.yearLevel = 'Year level is required';
    if (!data.course.trim()) e.course = 'Course is required';
    // Basic email validation + allowed domain
    const emailLower = data.email.toLowerCase();
    const basicEmail = /.+@.+\..+/i.test(emailLower);
    const validDomain = allowedDomains.some((d) => emailLower.endsWith(d));
    if (!basicEmail) e.email = 'Enter a valid email address';
    else if (!validDomain) e.email = 'Email must end with @gbox.ncf.edu.ph or @ncf.edu.ph';
    return e;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setQrDataUrl('');

    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length > 0) return; // invalid → show errors

    setIsSubmitting(true);
    try {
      // Encode the QR with the exact JSON contract expected by the scanner
      const payload = {
        student_id: form.studentId,
        name: form.name,
        section: form.section,
        year_level: form.yearLevel,
        course: form.course,
      };
      const dataUrl = await QRCode.toDataURL(JSON.stringify(payload), {
        width: 256,
        margin: 1,
        errorCorrectionLevel: 'M',
      });
      setQrDataUrl(dataUrl);
      setSuccessMessage('Registration complete. QR code is ready.');
    } catch (err) {
      setSuccessMessage('Registration complete, but failed to generate QR code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-gray-800">
      <div className="bg-white rounded-lg p-6 shadow-sm max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Student Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="studentId">
              Student ID
            </label>
            <input
              id="studentId"
              name="studentId"
              value={form.studentId}
              onChange={handleChange}
              placeholder="20-21001"
              className={`w-full px-4 py-2 rounded border ${
                errors.studentId ? 'border-red-400' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.studentId && (
              <p className="text-red-500 text-sm mt-1">{errors.studentId}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full px-4 py-2 rounded border ${
                errors.name ? 'border-red-400' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Section and Year Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="section">
                Section
              </label>
              <input
                id="section"
                name="section"
                value={form.section}
                onChange={handleChange}
                placeholder="A"
                className={`w-full px-4 py-2 rounded border ${
                  errors.section ? 'border-red-400' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.section && (
                <p className="text-red-500 text-sm mt-1">{errors.section}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="yearLevel">
                Year Level
              </label>
              <select
                id="yearLevel"
                name="yearLevel"
                value={form.yearLevel}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded border ${
                  errors.yearLevel ? 'border-red-400' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {['1st Year', '2nd Year', '3rd Year', '4th Year'].map((yl) => (
                  <option key={yl} value={yl}>
                    {yl}
                  </option>
                ))}
              </select>
              {errors.yearLevel && (
                <p className="text-red-500 text-sm mt-1">{errors.yearLevel}</p>
              )}
            </div>
          </div>

          {/* Course and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="course">
                Course
              </label>
              <select
                id="course"
                name="course"
                value={form.course}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded border ${
                  errors.course ? 'border-red-400' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {['BSCS', 'BSIT'].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.course && (
                <p className="text-red-500 text-sm mt-1">{errors.course}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="student@gbox.ncf.edu.ph"
                className={`w-full px-4 py-2 rounded border ${
                  errors.email ? 'border-red-400' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              {isSubmitting ? 'Processing...' : 'Register'}
            </button>
            {successMessage && (
              <span className="text-green-600 text-sm">{successMessage}</span>
            )}
          </div>
        </form>

        {/* QR Preview & Download */}
        {qrDataUrl && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <img src={qrDataUrl} alt="Registration QR" className="bg-white p-2 rounded shadow" />
            <a
              href={qrDataUrl}
              download={`registration-qr-${form.studentId}.png`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Download QR Code
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationForm;
