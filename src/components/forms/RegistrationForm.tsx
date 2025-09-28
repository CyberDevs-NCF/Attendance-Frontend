import React, { useState } from 'react';
import QRCode from 'qrcode';

interface FormData {
  fname: string;
  lname: string;
  section_year: string; // e.g. "BSCS 3A"
  student_id: string;   // format: 00-00000
  email: string;
}

interface FormErrors {
  fname?: string;
  lname?: string;
  section_year?: string;
  student_id?: string;
  email?: string;
}

export const RegistrationForm: React.FC = () => {
  const [form, setForm] = useState<FormData>({
    fname: '',
    lname: '',
    section_year: '',
    student_id: '',
    email: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const allowedDomains = ['@gbox.ncf.edu.ph', '@ncf.edu.ph'];

  const validate = (data: FormData): FormErrors => {
    const e: FormErrors = {};
    if (!data.fname.trim()) e.fname = 'First name is required';
    if (!data.lname.trim()) e.lname = 'Last name is required';
    if (!data.section_year) e.section_year = 'Course/Year/Section is required';
    if (!/^\d{2}-\d{5}$/.test(data.student_id)) e.student_id = 'Format must be 00-00000';
    const emailLower = data.email.toLowerCase();
    const basicEmail = /.+@.+\..+/i.test(emailLower);
    const validDomain = allowedDomains.some(d => emailLower.endsWith(d));
    if (!basicEmail) e.email = 'Enter a valid email address';
    else if (!validDomain) e.email = 'Must end with @gbox.ncf.edu.ph or @ncf.edu.ph';
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setQrDataUrl('');

    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setIsSubmitting(true);
    try {
      // Unified QR schema EXACTLY matching Student-QR-Generator
      const unifiedPayload = {
        institution: 'Naga College Foundation',
        first_name: form.fname.trim(),
        last_name: form.lname.trim(),
        course_year_section: form.section_year.trim(),
        student_id: form.student_id.trim(),
        email: form.email.trim(),
        generated_at: new Date().toISOString(),
        academic_year: '2024-2025'
      };

      const dataUrl = await QRCode.toDataURL(JSON.stringify(unifiedPayload, null, 2), {
        width: 256,
        margin: 1,
        errorCorrectionLevel: 'M',
      });
      setQrDataUrl(dataUrl);
      setSuccessMessage('Registration complete. QR code is ready.');
    } catch (err) {
      console.error('QR generation failed:', err);
      setSuccessMessage('Registration complete, but failed to generate QR code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-gray-800">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Form Card */}
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-6 border border-green-200/40 ring-1 ring-green-100/50">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-green-800 mb-2">Student Information</h2>
            <p className="text-green-700 text-sm">Enter the student details to generate an official NCF QR code</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
          {/* First & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fname" className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input
                id="fname"
                name="fname"
                value={form.fname}
                onChange={handleChange}
                placeholder="Enter first name"
                className={`w-full px-4 py-2 rounded border ${errors.fname ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.fname && <p className="text-red-500 text-sm mt-1">{errors.fname}</p>}
            </div>
            <div>
              <label htmlFor="lname" className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input
                id="lname"
                name="lname"
                value={form.lname}
                onChange={handleChange}
                placeholder="Enter last name"
                className={`w-full px-4 py-2 rounded border ${errors.lname ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.lname && <p className="text-red-500 text-sm mt-1">{errors.lname}</p>}
            </div>
          </div>

          {/* Course/Year/Section & Student ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="section_year" className="block text-sm font-medium text-gray-700 mb-1">Course/Year/Section *</label>
                <select
                  id="section_year"
                  name="section_year"
                  value={form.section_year}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded border ${errors.section_year ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select Course/Year/Section</option>
                  {/* Minimal subset; add more as needed */}
                  <option value="BSCS 1A">BSCS 1A</option>
                  <option value="BSCS 2A">BSCS 2A</option>
                  <option value="BSCS 3A">BSCS 3A</option>
                  <option value="BSCS 3B">BSCS 3B</option>
                  <option value="BSCS 4A">BSCS 4A</option>
                  <option value="BSIT 1A">BSIT 1A</option>
                  <option value="BSIT 2A">BSIT 2A</option>
                  <option value="BSIT 3A">BSIT 3A</option>
                  <option value="BSIT 4A">BSIT 4A</option>
                  <option value="BSIS 3A">BSIS 3A</option>
                  <option value="ACT 1A">ACT 1A</option>
                </select>
                {errors.section_year && <p className="text-red-500 text-sm mt-1">{errors.section_year}</p>}
              </div>
              <div>
                <label htmlFor="student_id" className="block text-sm font-medium text-gray-700 mb-1">Student ID *</label>
                <input
                  id="student_id"
                  name="student_id"
                  value={form.student_id}
                  onChange={handleChange}
                  placeholder="12-34567"
                  className={`w-full px-4 py-2 rounded border ${errors.student_id ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.student_id && <p className="text-red-500 text-sm mt-1">{errors.student_id}</p>}
              </div>
            </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@gbox.ncf.edu.ph"
              className={`w-full px-4 py-2 rounded border ${errors.email ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-green-700 via-green-600 to-green-500 hover:from-green-800 hover:via-green-700 hover:to-green-600 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                {isSubmitting ? 'Generating...' : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h4M4 8h4m4 0V4m0 0h4m0 0v4m0 0h4m0 4h-4M8 12V8m0 0H4m0 0v4m0 0h4" />
                    </svg>
                    Generate
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => { setForm({ fname:'', lname:'', section_year:'', student_id:'', email:'' }); setQrDataUrl(''); setSuccessMessage(''); setErrors({}); }}
                className="px-6 py-3 border-2 border-green-300 text-green-700 rounded-xl font-semibold hover:bg-green-50 hover:border-green-400 transition-all"
              >
                Reset
              </button>
            </div>
            {successMessage && (
              <div className="mt-3 bg-gradient-to-r from-green-50 to-yellow-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
                <span>{successMessage}</span>
              </div>
            )}
          </form>
        </div>

        {/* Right: Preview Panel */}
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-6 border border-green-200/40 ring-1 ring-green-100/50 flex flex-col justify-center">
          {!qrDataUrl && (
            <div className="text-center py-8">
              <div className="relative inline-block mb-6">
                <div className="w-28 h-28 bg-gradient-to-br from-green-100 to-yellow-100 rounded-3xl mx-auto flex items-center justify-center shadow-inner ring-2 ring-green-200/50">
                  <svg className="w-14 h-14 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h4M4 8h4m4 0V4m0 0h4m0 0v4m0 0h4m0 4h-4M8 12V8m0 0H4m0 0v4m0 0h4" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full animate-ping"></div>
              </div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">Ready to Generate NCF QR Code</h3>
              <p className="text-green-700 text-sm max-w-xs mx-auto leading-relaxed">
                Fill out the student information form and click "Generate" to create the official student identification QR code.
              </p>
              <div className="mt-4 flex items-center justify-center gap-1 text-green-500">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
              </div>
              <p className="text-green-600 text-xs mt-2">Complete all required fields</p>
            </div>
          )}
          {qrDataUrl && (
            <div className="animate-fade-in flex flex-col items-center">
              <div className="relative group mb-6">
                <div className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-3xl p-8 inline-block shadow-inner group-hover:shadow-lg transition-all duration-300 ring-2 ring-green-200/50">
                  <img src={qrDataUrl} alt="Student QR" className="mx-auto shadow-xl rounded-2xl ring-4 ring-white ring-opacity-50 transform group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full opacity-70 animate-pulse"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-yellow-500 to-green-500 rounded-full opacity-70 animate-pulse delay-300"></div>
              </div>
              <a
                href={qrDataUrl}
                download={`student-qr-${form.student_id}.png`}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-green-900 py-3 px-6 rounded-xl font-semibold hover:from-yellow-600 hover:to-yellow-500 focus:ring-4 focus:ring-yellow-200 transition-all flex items-center justify-center shadow-md hover:shadow-lg ring-2 ring-green-500/30"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </a>
              <div className="mt-6 w-full bg-gradient-to-r from-green-50 to-yellow-50 rounded-xl p-5 border border-green-200 shadow-inner ring-1 ring-green-100 text-sm text-green-700">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-yellow-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <strong className="text-green-900">QR Code Data</strong>
                </div>
                <div className="space-y-2 font-medium">
                  <div className="flex justify-between items-center py-1 border-b border-green-200"><span className="text-green-600">Student Name:</span><span className="text-green-900">{form.fname} {form.lname}</span></div>
                  <div className="flex justify-between items-center py-1 border-b border-green-200"><span className="text-green-600">Course/Year/Section:</span><span className="text-green-900">{form.section_year}</span></div>
                  <div className="flex justify-between items-center py-1 border-b border-green-200"><span className="text-green-600">Student ID:</span><span className="text-green-900 font-mono">{form.student_id}</span></div>
                  <div className="flex justify-between items-center py-1"><span className="text-green-600">Email:</span><span className="text-green-900 font-mono">{form.email}</span></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
