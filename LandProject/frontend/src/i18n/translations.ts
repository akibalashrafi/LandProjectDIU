export type Language = 'bn' | 'en';

export const translations = {
  bn: {
    // Brand & Taglines
    appName: 'LandSure BD',
    appSubTitle: 'ডিজিটাল ভূমি মালিকানা ব্যবস্থাপনা ও জালিয়াতি প্রতিরোধ প্ল্যাটফর্ম',
    tagline: 'দলিল যাচাই করুন। জমির রেকর্ড সুরক্ষিত রাখুন। আস্থা গড়ে তুলুন।',
    demoDisclaimer: 'ডেমো ডেটা — সরকারি অফিসিয়াল রেকর্ড নয়। এটি হ্যাকাথন ও প্রযুক্তিগত প্রদর্শনের জন্য তৈরি।',

    // Navigation
    navHome: 'হোম',
    navHowItWorks: 'কীভাবে কাজ করে',
    navVerificationRules: 'যাচাই নীতিমালা',
    navPublicVerify: 'পাবলিক যাচাই',
    navLogin: 'লগইন',
    navRegister: 'নিবন্ধন',
    navDashboard: 'ড্যাশবোর্ড',
    navMyLands: 'আমার জমি',
    navAddLand: 'নতুন জমি যোগ',
    navMyDocuments: 'আমার দলিলপত্র',
    navUploadDoc: 'দলিল আপলোড',
    navVerificationReports: 'যাচাই প্রতিবেদন',
    navTransactions: 'লেনদেনের ইতিহাস',
    navNewTransaction: 'বিক্রয় প্রস্তাব',
    navAlerts: 'জালিয়াতি সতর্কতা',
    navConsentRequests: 'অনুমতি অনুরোধ',
    navAuditLogs: 'অডিট লগ',
    navAdminPanel: 'অ্যাডমিন প্যানেল',
    navLogout: 'লগআউট',

    // Actions & Buttons
    btnSearch: 'অনুসন্ধান করুন',
    btnVerify: 'যাচাই করুন',
    btnSubmit: 'জমা দিন',
    btnCancel: 'বাতিল',
    btnConfirm: 'নিশ্চিত করুন',
    btnAccept: 'গ্রহণ করুন',
    btnReject: 'প্রত্যাখ্যান',
    btnApprove: 'অনুমোদন করুন',
    btnDownloadQR: 'QR কোড ডাউনলোড',
    btnReCheck: 'পুনরায় বিশ্লেষণ চালান',
    btnRequestOtp: 'OTP পাঠান',
    btnVerifyOtp: 'OTP যাচাই করুন',
    btnQuickLogin: 'দ্রুত ডেমো লগইন',

    // Statuses
    statusPending: 'যাচাই অপেক্ষমাণ',
    statusFileIntegrityPassed: 'ফাইল ডিজিটাল অখণ্ডতা সঠিক',
    statusRecordMatch: 'রেকর্ড হুবহু মিলেছে',
    statusWarning: 'সতর্কতা / অমিল',
    statusNeedsManualReview: 'ম্যানুয়াল পর্যালোচনা প্রয়োজন',
    statusReferenceUnavailable: 'তথ্যসূত্র অপর্যাপ্ত',
    statusRejected: 'প্রত্যাখ্যাত',
    statusSuperseded: 'পূর্ববর্তী সংস্করণ',
    statusCompleted: 'সম্পন্ন',
    statusSubmitted: 'জমা দেওয়া হয়েছে',
    statusAwaitingBuyer: 'ক্রেতার সম্মতির অপেক্ষায়',
    statusAwaitingEvidence: 'হস্তান্তর দলিলের অপেক্ষায়',

    // Dashboard Cards
    cardTotalLands: 'মোট নিবন্ধিত জমি',
    cardTotalArea: 'মোট মালিকানার পরিমাণ',
    cardDocumentsSubmitted: 'জমা দেওয়া দলিল',
    cardDocumentsWithWarnings: 'সতর্কতাপ্রাপ্ত দলিল',
    cardPendingTransactions: 'চলমান লেনদেন',
    cardCompletedTransactions: 'সম্পন্ন লেনদেন',
    cardActiveAlerts: 'সক্রিয় জালিয়াতি সতর্কতা',
    cardPendingConsent: 'নাগরিক অনুমতি অপেক্ষমাণ',

    // Land Parcel Fields
    fieldDistrict: 'জেলা',
    fieldUpazila: 'উপজেলা / সার্কেল',
    fieldMouza: 'মৌজা',
    fieldJlNumber: 'জে.এল নম্বর',
    fieldKhatianNumber: 'খতিয়ান নম্বর',
    fieldPlotNumber: 'দাগ নম্বর',
    fieldSurveyType: 'সার্ভে / জরিপ ধরণ',
    fieldTotalArea: 'জমির মোট আয়তন',
    fieldAreaUnit: 'পরিমাপ একক',
    fieldClaimedShare: 'মালিকানার অংশ / হিস্যা',
    fieldAcquisitionMethod: 'মালিকানা অর্জনের মাধ্যম',
    fieldAcquisitionDate: 'অর্জনের তারিখ',
    fieldDeedRef: 'মূল দলিল নম্বর',
    fieldNotes: 'মন্তব্য ও প্রমাণ',

    // Fraud Detection Terms
    fraudDuplicateSale: 'সম্ভাব্য একাধিক বিক্রি',
    fraudMutationMismatch: 'নামজারি রেকর্ডে অমিল',
    fraudShareExceeded: 'মালিকানা অংশের অতিরিক্ত বিক্রি',
    fraudHashMismatch: 'দলিলের ডিজিটাল হ্যাশ অমিল',
    fraudConflictingClaims: 'পরস্পরবিরোধী মালিকানা দাবি',
    severityCritical: 'জরুরি / মারাত্মক',
    severityHigh: 'উচ্চ ঝুঁকি',
    severityMedium: 'মাঝারি',
    severityLow: 'সাধারণ',

    // Public Pages
    heroTitle: 'বাংলাদেশের জন্য আধুনিক ও নিরাপদ ডিজিটাল ভূমি রেকর্ড ব্যবস্থাপনা',
    heroSubtitle: 'জালিয়াতি শনাক্তকরণ, দলিলের ডিজিটাল সততা যাচাই এবং স্বচ্ছ ভূমি লেনদেনের জাতীয় মডেল।',
    searchPlaceholder: 'যাচাই টোকেন অথবা দাগ নম্বর লিখুন...',
    feature1Title: 'দলিল অখণ্ডতা ও হ্যাশ যাচাই',
    feature1Desc: 'ক্রিপ্টোগ্রাফিক SHA-256 অ্যালগরিদমের মাধ্যমে দলিলের কোনো পাতা বা তথ্য পরিবর্তন করা হয়েছে কিনা তা স্বয়ংক্রিয়ভাবে শনাক্ত হয়।',
    feature2Title: 'একাধিক বিক্রি ও অমিল শনাক্তকরণ',
    feature2Desc: 'একই জমি একাধিক ক্রেতার কাছে বিক্রয়, ভুয়া দাগ বা অতিরিক্ত জমি হস্তান্তরের চেষ্টা সাথে সাথে ফ্ল্যাগ করে।',
    feature3Title: 'নাগরিকের ওটিপি সম্মতি ও অডিট ট্রেইল',
    feature3Desc: 'অ্যাডমিন বা কর্মকর্তা কোনো রেকর্ডে পরিবর্তন আনতে চাইলে নাগরিকের নিবন্ধিত ফোনে ওটিপি পাঠানো ও সম্মতি নেওয়া বাধ্যতামূলক।',

    // User Roles
    roleCitizen: 'সাধারণ নাগরিক',
    roleAdmin: 'সিস্টেম অ্যাডমিন',
    roleReviewer: 'অনুমোদিত তদন্তকারী (ভূমি সহকারী কর্মকর্তা)',
    
    // Units
    unitDecimal: 'শতাংশ / ডেসিমাল',
    unitAcre: 'একর',
    unitSqft: 'বর্গফুট'
  },
  en: {
    // Brand & Taglines
    appName: 'LandSure BD',
    appSubTitle: 'Digital Land Ownership Management & Fraud Detection Platform',
    tagline: 'Verify Documents. Protect Land Records. Build Trust.',
    demoDisclaimer: 'DEMO DATA — NOT AN OFFICIAL GOVERNMENT LAND RECORD. Built for hackathon and technical demonstration.',

    // Navigation
    navHome: 'Home',
    navHowItWorks: 'How It Works',
    navVerificationRules: 'Verification Rules',
    navPublicVerify: 'Public Verification',
    navLogin: 'Login',
    navRegister: 'Register',
    navDashboard: 'Dashboard',
    navMyLands: 'My Lands',
    navAddLand: 'Add New Land',
    navMyDocuments: 'My Documents',
    navUploadDoc: 'Upload Document',
    navVerificationReports: 'Verification Reports',
    navTransactions: 'Transaction History',
    navNewTransaction: 'New Sale Proposal',
    navAlerts: 'Fraud Alerts',
    navConsentRequests: 'Consent Requests',
    navAuditLogs: 'Audit Logs',
    navAdminPanel: 'Admin Panel',
    navLogout: 'Logout',

    // Actions & Buttons
    btnSearch: 'Search',
    btnVerify: 'Verify',
    btnSubmit: 'Submit',
    btnCancel: 'Cancel',
    btnConfirm: 'Confirm',
    btnAccept: 'Accept',
    btnReject: 'Reject',
    btnApprove: 'Approve Transfer',
    btnDownloadQR: 'Download QR Code',
    btnReCheck: 'Re-run Analysis',
    btnRequestOtp: 'Send OTP',
    btnVerifyOtp: 'Verify OTP',
    btnQuickLogin: 'Quick Demo Login',

    // Statuses
    statusPending: 'Pending Review',
    statusFileIntegrityPassed: 'File Integrity Passed',
    statusRecordMatch: 'Record Match',
    statusWarning: 'Warning / Discrepancy',
    statusNeedsManualReview: 'Needs Manual Review',
    statusReferenceUnavailable: 'Reference Unavailable',
    statusRejected: 'Rejected',
    statusSuperseded: 'Superseded',
    statusCompleted: 'Completed',
    statusSubmitted: 'Submitted',
    statusAwaitingBuyer: 'Awaiting Buyer Consent',
    statusAwaitingEvidence: 'Awaiting Official Transfer Evidence',

    // Dashboard Cards
    cardTotalLands: 'Total Recorded Parcels',
    cardTotalArea: 'Total Recorded Land Area',
    cardDocumentsSubmitted: 'Documents Submitted',
    cardDocumentsWithWarnings: 'Documents With Warnings',
    cardPendingTransactions: 'Pending Transactions',
    cardCompletedTransactions: 'Completed Transactions',
    cardActiveAlerts: 'Active Fraud Alerts',
    cardPendingConsent: 'Pending Citizen Consent',

    // Land Parcel Fields
    fieldDistrict: 'District',
    fieldUpazila: 'Upazila / Circle',
    fieldMouza: 'Mouza',
    fieldJlNumber: 'J.L. Number',
    fieldKhatianNumber: 'Khatian Number',
    fieldPlotNumber: 'Plot / Dag Number',
    fieldSurveyType: 'Survey / Cadastral Type',
    fieldTotalArea: 'Total Parcel Area',
    fieldAreaUnit: 'Measurement Unit',
    fieldClaimedShare: 'Ownership Share / Portion',
    fieldAcquisitionMethod: 'Acquisition Method',
    fieldAcquisitionDate: 'Acquisition Date',
    fieldDeedRef: 'Source Deed Reference',
    fieldNotes: 'Notes & Supporting Evidence',

    // Fraud Detection Terms
    fraudDuplicateSale: 'Potential Duplicate Sale',
    fraudMutationMismatch: 'Mutation Record Mismatch',
    fraudShareExceeded: 'Seller Ownership-Share Exceeded',
    fraudHashMismatch: 'Document Hash Integrity Mismatch',
    fraudConflictingClaims: 'Conflicting Ownership Claims',
    severityCritical: 'Critical',
    severityHigh: 'High Risk',
    severityMedium: 'Medium',
    severityLow: 'Low',

    // Public Pages
    heroTitle: 'Modern, Trustworthy Digital Land Ownership Management for Bangladesh',
    heroSubtitle: 'National prototype for fraud detection, document cryptographic integrity, and transparent land transfers.',
    searchPlaceholder: 'Enter verification token or plot number...',
    feature1Title: 'Cryptographic Document Integrity',
    feature1Desc: 'Automated SHA-256 checks detect if any deed file, text, or page has been modified from repository references.',
    feature2Title: 'Duplicate Sale & Mismatch Detection',
    feature2Desc: 'Instantly identifies overlapping deeds on the same plot, excess share sales, and buyer-seller name mismatches.',
    feature3Title: 'Citizen OTP Consent & Audit Trail',
    feature3Desc: 'Administrators cannot alter records silently. Citizen receives an expiring mobile OTP and must grant explicit consent.',

    // User Roles
    roleCitizen: 'Citizen',
    roleAdmin: 'System Admin',
    roleReviewer: 'Authorized Reviewer (AC Land / Surveyor)',

    // Units
    unitDecimal: 'Decimal',
    unitAcre: 'Acre',
    unitSqft: 'Square Feet'
  }
};
