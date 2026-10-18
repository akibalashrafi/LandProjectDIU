import crypto from 'crypto';
import bcrypt from 'bcryptjs';
export async function generateSeedData() {
    const passwordSalt = await bcrypt.genSalt(10);
    const userPasswordHash = await bcrypt.hash('Password123!', passwordSalt);
    const adminPasswordHash = await bcrypt.hash('AdminPassword123!', passwordSalt);
    const reviewerPasswordHash = await bcrypt.hash('ReviewerPassword123!', passwordSalt);
    const users = [
        {
            id: 'usr-demo-001',
            fullName: 'Tanvir Ahmed (তানভীর আহমেদ)',
            phone: '01711000001',
            email: 'tanvir@example.com',
            passwordHash: userPasswordHash,
            role: 'CITIZEN',
            address: 'House 42, Road 11, Dhanmondi, Dhaka',
            nidMasked: '1988************42',
            isVerified: true,
            createdAt: '2026-01-15T08:00:00.000Z',
            updatedAt: '2026-01-15T08:00:00.000Z'
        },
        {
            id: 'usr-demo-002',
            fullName: 'Farhana Yasmin (ফারহানা ইয়াসমিন)',
            phone: '01711000002',
            email: 'farhana@example.com',
            passwordHash: userPasswordHash,
            role: 'CITIZEN',
            address: 'Sector 4, Uttara, Dhaka',
            nidMasked: '1992************19',
            isVerified: true,
            createdAt: '2026-01-20T09:30:00.000Z',
            updatedAt: '2026-01-20T09:30:00.000Z'
        },
        {
            id: 'usr-demo-003',
            fullName: 'Rafiqul Islam (রফিকুল ইসলাম)',
            phone: '01711000003',
            email: 'rafiq@example.com',
            passwordHash: userPasswordHash,
            role: 'CITIZEN',
            address: 'South Badda, Gulshan, Dhaka',
            nidMasked: '1975************88',
            isVerified: true,
            createdAt: '2026-02-01T10:00:00.000Z',
            updatedAt: '2026-02-01T10:00:00.000Z'
        },
        {
            id: 'usr-admin-001',
            fullName: 'Anisur Rahman (আনিসুর রহমান - সিস্টেম অ্যাডমিন)',
            phone: '01811000001',
            email: 'admin@landsure.gov.bd',
            passwordHash: adminPasswordHash,
            role: 'ADMIN',
            address: 'Land Ministry Complex, Segunbagicha, Dhaka',
            nidMasked: '1980************99',
            isVerified: true,
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z'
        },
        {
            id: 'usr-rev-001',
            fullName: 'Shamima Nasreen (শামীমা নাসরিন - সহকারী কমিশনার ভূমি/তদন্তকারী)',
            phone: '01911000001',
            email: 'reviewer@landsure.gov.bd',
            passwordHash: reviewerPasswordHash,
            role: 'REVIEWER',
            address: 'Upazila Land Office, Gulshan Circle, Dhaka',
            nidMasked: '1985************77',
            isVerified: true,
            createdAt: '2026-01-05T00:00:00.000Z',
            updatedAt: '2026-01-05T00:00:00.000Z'
        }
    ];
    const parcels = [
        // Scenario 1: Clean record, no discrepancies
        {
            id: 'pcl-demo-1001',
            internalParcelId: 'DEMO-PARCEL-1001',
            district: 'Dhaka (ঢাকা)',
            upazila: 'Tejgaon (তেজগাঁও)',
            mouza: 'Tejgaon I/A (তেজগাঁও শিল্প এলাকা)',
            jlNumber: 'JL-102',
            khatianNumber: '890',
            plotNumber: '342',
            surveyType: 'BS (বাংলাদেশ সার্ভে)',
            totalArea: 5.5,
            areaUnit: 'decimal',
            sourceDeedRef: 'DEED-TEJ-2021-998',
            verificationStatus: 'RECORD_MATCH',
            notes: 'Clean title deed matched with BS Porcha and e-Mutation Record.',
            isDisputed: false,
            createdAt: '2026-01-16T10:00:00.000Z',
            updatedAt: '2026-01-16T10:00:00.000Z'
        },
        // Scenario 2: Potential Duplicate Sale Alert (Plot 1042)
        {
            id: 'pcl-demo-1042',
            internalParcelId: 'DEMO-PARCEL-1042',
            district: 'Dhaka (ঢাকা)',
            upazila: 'Gulshan (গুলশান)',
            mouza: 'Badda (বাড্ডা)',
            jlNumber: 'JL-204',
            khatianNumber: '1205',
            plotNumber: '1042',
            surveyType: 'RS (রিভিশনাল সার্ভে)',
            totalArea: 6.0,
            areaUnit: 'decimal',
            sourceDeedRef: 'DEED-BAD-2023-412',
            verificationStatus: 'WARNING',
            notes: 'Potential duplicate registration flagged between DEMO-REG-001 and DEMO-REG-002.',
            isDisputed: true,
            createdAt: '2026-01-18T11:00:00.000Z',
            updatedAt: '2026-02-10T14:30:00.000Z'
        },
        // Scenario 3: Mutation Record Mismatch
        {
            id: 'pcl-demo-1055',
            internalParcelId: 'DEMO-PARCEL-1055',
            district: 'Dhaka (ঢাকা)',
            upazila: 'Uttara (উত্তরা)',
            mouza: 'Baunia (বাউনিয়া)',
            jlNumber: 'JL-311',
            khatianNumber: '412',
            plotNumber: '771',
            surveyType: 'RS (রিভিশনাল সার্ভে)',
            totalArea: 3.8,
            areaUnit: 'decimal',
            sourceDeedRef: 'DEED-UTT-2024-105',
            verificationStatus: 'NEEDS_MANUAL_REVIEW',
            notes: 'Deed buyer listed as Karim; Reference Mutation khatian records Rahim as owner.',
            isDisputed: false,
            createdAt: '2026-01-22T09:00:00.000Z',
            updatedAt: '2026-01-25T16:00:00.000Z'
        },
        // Scenario 4: Hash integrity mismatch
        {
            id: 'pcl-demo-1088',
            internalParcelId: 'DEMO-PARCEL-1088',
            district: 'Gazipur (গাজীপুর)',
            upazila: 'Joydebpur (জয়দেবপুর)',
            mouza: 'Chowrasta (চৌরাস্তা)',
            jlNumber: 'JL-401',
            khatianNumber: '615',
            plotNumber: '554',
            surveyType: 'BS (বাংলাদেশ সার্ভে)',
            totalArea: 8.0,
            areaUnit: 'decimal',
            sourceDeedRef: 'DEED-GAZ-2022-881',
            verificationStatus: 'WARNING',
            notes: 'Digital deed copy does not match official registry reference hash.',
            isDisputed: false,
            createdAt: '2026-02-05T12:00:00.000Z',
            updatedAt: '2026-02-05T12:00:00.000Z'
        },
        // Scenario 5: Seller Share Exceeded Demonstration
        {
            id: 'pcl-demo-1090',
            internalParcelId: 'DEMO-PARCEL-1090',
            district: 'Chattogram (চট্টগ্রাম)',
            upazila: 'Panchlaish (পাঁচলাইশ)',
            mouza: 'Nasirabad (নাসিরাবাদ)',
            jlNumber: 'JL-105',
            khatianNumber: '330',
            plotNumber: '112',
            surveyType: 'BS (বাংলাদেশ সার্ভে)',
            totalArea: 10.0,
            areaUnit: 'decimal',
            sourceDeedRef: 'DEED-CTG-2020-009',
            verificationStatus: 'NEEDS_MANUAL_REVIEW',
            notes: 'Seller holds 2.5 decimals but proposed sale is 4.0 decimals.',
            isDisputed: false,
            createdAt: '2026-02-11T14:00:00.000Z',
            updatedAt: '2026-02-11T14:00:00.000Z'
        }
    ];
    const ownershipClaims = [
        // Tanvir owns Parcel 1001 (5.5 decimals, 100%)
        {
            id: 'clm-demo-001',
            parcelId: 'pcl-demo-1001',
            userId: 'usr-demo-001',
            claimedShare: 5.5,
            recordSupportedShare: 5.5,
            status: 'CONFIRMED',
            acquisitionMethod: 'PURCHASE',
            acquisitionDate: '2021-04-12',
            createdAt: '2026-01-16T10:00:00.000Z',
            updatedAt: '2026-01-16T10:00:00.000Z'
        },
        // Tanvir claims 4.0 decimals on Parcel 1042
        {
            id: 'clm-demo-002',
            parcelId: 'pcl-demo-1042',
            userId: 'usr-demo-001',
            claimedShare: 4.0,
            recordSupportedShare: 4.0,
            status: 'DISPUTED',
            acquisitionMethod: 'PURCHASE',
            acquisitionDate: '2023-08-19',
            createdAt: '2026-01-18T11:00:00.000Z',
            updatedAt: '2026-02-10T14:30:00.000Z'
        },
        // Rafiqul also claims overlapping 4.0 decimals on Parcel 1042!
        {
            id: 'clm-demo-003',
            parcelId: 'pcl-demo-1042',
            userId: 'usr-demo-003',
            claimedShare: 4.0,
            recordSupportedShare: 2.0,
            status: 'DISPUTED',
            acquisitionMethod: 'INHERITANCE',
            acquisitionDate: '2023-11-04',
            createdAt: '2026-01-19T14:00:00.000Z',
            updatedAt: '2026-02-10T14:30:00.000Z'
        },
        // Tanvir owns 3.8 decimals on Parcel 1055
        {
            id: 'clm-demo-004',
            parcelId: 'pcl-demo-1055',
            userId: 'usr-demo-001',
            claimedShare: 3.8,
            recordSupportedShare: 3.8,
            status: 'CLAIMED',
            acquisitionMethod: 'PURCHASE',
            acquisitionDate: '2024-02-15',
            createdAt: '2026-01-22T09:00:00.000Z',
            updatedAt: '2026-01-25T16:00:00.000Z'
        },
        // Tanvir owns 2.5 decimals on Parcel 1090 (out of 10.0 total)
        {
            id: 'clm-demo-005',
            parcelId: 'pcl-demo-1090',
            userId: 'usr-demo-001',
            claimedShare: 2.5,
            recordSupportedShare: 2.5,
            status: 'CONFIRMED',
            acquisitionMethod: 'INHERITANCE',
            acquisitionDate: '2020-01-10',
            createdAt: '2026-02-11T14:00:00.000Z',
            updatedAt: '2026-02-11T14:00:00.000Z'
        }
    ];
    // Documents
    const doc1Hash = crypto.createHash('sha256').update('DEMO_VALID_DEED_FILE_CONTENT_1001').digest('hex');
    const doc2Hash = crypto.createHash('sha256').update('DEMO_DEED_CONTENT_1042_REG001').digest('hex');
    const doc3Hash = crypto.createHash('sha256').update('DEMO_MUTATION_CONTENT_1055_MISMATCH').digest('hex');
    const doc4TamperedHash = crypto.createHash('sha256').update('TAMPERED_DEED_CONTENT_1088').digest('hex');
    const documents = [
        {
            id: 'doc-demo-001',
            documentId: 'DOC-DEMO-001',
            category: 'REGISTERED_DEED',
            parcelId: 'pcl-demo-1001',
            uploaderId: 'usr-demo-001',
            originalFilename: 'registered_deed_tejgaon_890.pdf',
            storagePath: '/uploads/registered_deed_tejgaon_890.pdf',
            fileSizeBytes: 2450000,
            mimeType: 'application/pdf',
            sha256Hash: doc1Hash,
            verificationStatus: 'FILE_INTEGRITY_PASSED',
            reviewNotes: 'Matches sub-registry archive reference hash 100%.',
            version: 1,
            referenceSource: 'Sub-Registrar Office, Tejgaon Records (Simulated)',
            isDigitallySigned: true,
            publicToken: 'tok-verify-clean-1001',
            structuredData: {
                buyerName: 'Tanvir Ahmed',
                sellerName: 'Abdul Malek',
                deedNumber: 'DEED-TEJ-2021-998',
                khatianNumber: '890',
                plotNumber: '342',
                mouza: 'Tejgaon I/A',
                district: 'Dhaka',
                upazila: 'Tejgaon',
                deedDate: '2021-04-12',
                landArea: 5.5,
                areaUnit: 'decimal'
            },
            createdAt: '2026-01-16T10:15:00.000Z',
            updatedAt: '2026-01-16T10:15:00.000Z'
        },
        {
            id: 'doc-demo-002',
            documentId: 'DOC-DEMO-002',
            category: 'REGISTERED_DEED',
            parcelId: 'pcl-demo-1042',
            uploaderId: 'usr-demo-001',
            originalFilename: 'sale_deed_badda_reg001.pdf',
            storagePath: '/uploads/sale_deed_badda_reg001.pdf',
            fileSizeBytes: 1820000,
            mimeType: 'application/pdf',
            sha256Hash: doc2Hash,
            verificationStatus: 'WARNING',
            reviewNotes: 'Overlapping plot transaction detected with REG-DEMO-002.',
            version: 1,
            referenceSource: 'Sub-Registrar Office, Badda Records (Simulated)',
            isDigitallySigned: false,
            publicToken: 'tok-verify-badda-1042',
            structuredData: {
                buyerName: 'Tanvir Ahmed',
                sellerName: 'Mokbul Hossain',
                deedNumber: 'DEMO-REG-001',
                khatianNumber: '1205',
                plotNumber: '1042',
                mouza: 'Badda',
                district: 'Dhaka',
                upazila: 'Gulshan',
                deedDate: '2023-08-19',
                landArea: 4.0,
                areaUnit: 'decimal'
            },
            createdAt: '2026-01-18T11:20:00.000Z',
            updatedAt: '2026-02-10T14:30:00.000Z'
        },
        {
            id: 'doc-demo-003',
            documentId: 'DOC-DEMO-003',
            category: 'MUTATION_ORDER',
            parcelId: 'pcl-demo-1055',
            uploaderId: 'usr-demo-001',
            originalFilename: 'mutation_order_uttara_412.pdf',
            storagePath: '/uploads/mutation_order_uttara_412.pdf',
            fileSizeBytes: 1200000,
            mimeType: 'application/pdf',
            sha256Hash: doc3Hash,
            verificationStatus: 'NEEDS_MANUAL_REVIEW',
            reviewNotes: 'Buyer mismatch: Deed names Karim, mutation names Rahim.',
            version: 1,
            referenceSource: 'AC Land Office, Uttara (Simulated e-Mutation)',
            isDigitallySigned: true,
            publicToken: 'tok-verify-uttara-1055',
            structuredData: {
                buyerName: 'Rahim (রহিম)',
                sellerName: 'Abdul Jalil',
                deedNumber: 'MUT-UTT-2024-412',
                khatianNumber: '412',
                plotNumber: '771',
                mouza: 'Baunia',
                district: 'Dhaka',
                upazila: 'Uttara',
                deedDate: '2024-03-01',
                landArea: 3.8,
                areaUnit: 'decimal'
            },
            createdAt: '2026-01-22T09:30:00.000Z',
            updatedAt: '2026-01-25T16:00:00.000Z'
        },
        {
            id: 'doc-demo-004',
            documentId: 'DOC-DEMO-004',
            category: 'REGISTERED_DEED',
            parcelId: 'pcl-demo-1088',
            uploaderId: 'usr-demo-001',
            originalFilename: 'deed_gazipur_tampered.pdf',
            storagePath: '/uploads/deed_gazipur_tampered.pdf',
            fileSizeBytes: 3100000,
            mimeType: 'application/pdf',
            sha256Hash: doc4TamperedHash,
            verificationStatus: 'WARNING',
            reviewNotes: 'SHA-256 hash does not match government repository reference hash.',
            version: 1,
            referenceSource: 'Sub-Registrar Joydebpur Reference Manifest',
            isDigitallySigned: false,
            publicToken: 'tok-verify-tamper-1088',
            structuredData: {
                buyerName: 'Tanvir Ahmed',
                sellerName: 'Sikder Enterprise',
                deedNumber: 'DEED-GAZ-2022-881',
                khatianNumber: '615',
                plotNumber: '554',
                mouza: 'Chowrasta',
                district: 'Gazipur',
                upazila: 'Joydebpur',
                landArea: 8.0,
                areaUnit: 'decimal'
            },
            createdAt: '2026-02-05T12:10:00.000Z',
            updatedAt: '2026-02-05T12:10:00.000Z'
        }
    ];
    // Verification Reports
    const verificationReports = [
        {
            id: 'rep-demo-001',
            documentId: 'doc-demo-001',
            parcelId: 'pcl-demo-1001',
            fileIntegrityPassed: true,
            referenceHashMatched: true,
            recordMatchStatus: 'MATCHED',
            discrepanciesJson: [],
            overallStatus: 'RECORD_MATCH',
            reviewerNotes: 'Verified against simulated Tejgaon sub-registry index. All parameters align.',
            verifiedAt: '2026-01-16T10:20:00.000Z'
        },
        {
            id: 'rep-demo-002',
            documentId: 'doc-demo-002',
            parcelId: 'pcl-demo-1042',
            fileIntegrityPassed: true,
            referenceHashMatched: true,
            recordMatchStatus: 'MISMATCH',
            discrepanciesJson: [
                {
                    field: 'Plot Share Allocation',
                    expected: 'Exclusive non-overlapping sale',
                    actual: 'Another registered deed (DEMO-REG-002) claims same 4.0 decimals',
                    severity: 'CRITICAL',
                    description: 'Potential duplicate transfer detected for Plot 1042.'
                }
            ],
            overallStatus: 'WARNING',
            reviewerNotes: 'Escalated to Assistant Commissioner (Land) review queue.',
            verifiedAt: '2026-01-18T11:30:00.000Z'
        },
        {
            id: 'rep-demo-003',
            documentId: 'doc-demo-003',
            parcelId: 'pcl-demo-1055',
            fileIntegrityPassed: true,
            referenceHashMatched: false,
            recordMatchStatus: 'MISMATCH',
            discrepanciesJson: [
                {
                    field: 'Buyer Name (ক্রেতার নাম)',
                    expected: 'Karim (করিম) [from submitted deed]',
                    actual: 'Rahim (রহিম) [from mutation ledger]',
                    severity: 'HIGH',
                    description: 'Discrepancy in recorded buyer between deed and mutation ledger.'
                }
            ],
            overallStatus: 'NEEDS_MANUAL_REVIEW',
            reviewerNotes: 'Requires verification of chain deed or correction khatian.',
            verifiedAt: '2026-01-22T09:45:00.000Z'
        },
        {
            id: 'rep-demo-004',
            documentId: 'doc-demo-004',
            parcelId: 'pcl-demo-1088',
            fileIntegrityPassed: false,
            referenceHashMatched: false,
            recordMatchStatus: 'INCONCLUSIVE',
            discrepanciesJson: [
                {
                    field: 'SHA-256 Checksum',
                    expected: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                    actual: doc4TamperedHash,
                    severity: 'HIGH',
                    description: 'File contents differ from trusted repository checksum.'
                }
            ],
            overallStatus: 'WARNING',
            reviewerNotes: 'File re-scan required. Suspected document modification.',
            verifiedAt: '2026-02-05T12:20:00.000Z'
        }
    ];
    // Fraud Alerts
    const fraudAlerts = [
        // Alert 1: Potential Duplicate Sale
        {
            id: 'alt-demo-001',
            alertId: 'ALERT-DEMO-001',
            category: 'DUPLICATE_SALE',
            parcelId: 'pcl-demo-1042',
            relatedTxId: 'DEMO-REG-001',
            relatedDocId: 'doc-demo-002',
            severity: 'CRITICAL',
            title: 'Potential Duplicate Sale Detected (সম্ভাব্য একাধিক বিক্রি শনাক্ত)',
            explanation: 'Two transaction records appear to overlap for the same plot and land share. Total plot area is 6.0 decimals, but combined claims total 8.0 decimals.',
            conflictingFields: {
                plotId: 'PLOT-1042',
                deedOne: 'DEMO-REG-001 (Tanvir Ahmed - 4.0 decimal)',
                deedTwo: 'DEMO-REG-002 (Rafiqul Islam - 4.0 decimal)',
                totalParcelArea: '6.0 decimal',
                overlappingExcess: '2.0 decimal'
            },
            evidenceSource: 'Sub-Registry Index cross-match (Simulated Reference)',
            status: 'OPEN',
            reviewerNotes: 'Pending hearing at Upazila Land Office.',
            detectedAt: '2026-01-18T11:25:00.000Z'
        },
        // Alert 2: Mutation Record Mismatch
        {
            id: 'alt-demo-002',
            alertId: 'ALERT-DEMO-002',
            category: 'MUTATION_MISMATCH',
            parcelId: 'pcl-demo-1055',
            relatedDocId: 'doc-demo-003',
            severity: 'HIGH',
            title: 'Mutation Record Mismatch (নামজারি রেকর্ডে অমিল)',
            explanation: 'Buyer information differs between the submitted deed record and the available mutation record.',
            conflictingFields: {
                deedBuyer: 'Karim (করিম)',
                mutationBuyer: 'Rahim (রহিম)',
                khatianNumber: '412',
                plotNumber: '771'
            },
            evidenceSource: 'e-Mutation Reference Service (Simulated)',
            status: 'UNDER_REVIEW',
            reviewerNotes: 'Reviewer Shamima Nasreen assigned for field verification.',
            detectedAt: '2026-01-22T09:40:00.000Z'
        },
        // Alert 3: Document Checksum Integrity Mismatch
        {
            id: 'alt-demo-003',
            alertId: 'ALERT-DEMO-003',
            category: 'HASH_MISMATCH',
            parcelId: 'pcl-demo-1088',
            relatedDocId: 'doc-demo-004',
            severity: 'HIGH',
            title: 'Document Hash Mismatch (দলিলের ডিজিটাল হ্যাশ অমিল)',
            explanation: 'Calculated SHA-256 file checksum does not match official digital registration registry reference hash.',
            conflictingFields: {
                expectedSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                actualSha256: doc4TamperedHash
            },
            evidenceSource: 'LandSure Cryptographic Registry Hash Index',
            status: 'OPEN',
            reviewerNotes: 'Flagged for integrity re-check.',
            detectedAt: '2026-02-05T12:15:00.000Z'
        },
        // Alert 4: Share Exceeded
        {
            id: 'alt-demo-004',
            alertId: 'ALERT-DEMO-004',
            category: 'SHARE_EXCEEDED',
            parcelId: 'pcl-demo-1090',
            relatedTxId: 'TX-DEMO-2026-005',
            severity: 'CRITICAL',
            title: 'Proposed Sale Exceeds Owned Share (মালিকানা অংশের অতিরিক্ত বিক্রয় প্রস্তাব)',
            explanation: 'Seller holds 2.5 decimals verified share on Plot 112, but proposed transaction attempts to sell 4.0 decimals.',
            conflictingFields: {
                recordedShare: '2.5 decimal',
                proposedSale: '4.0 decimal',
                deficit: '1.5 decimal'
            },
            evidenceSource: 'LandSure Ownership Share Calculator',
            status: 'OPEN',
            reviewerNotes: 'Transaction blocked automatically by rule engine.',
            detectedAt: '2026-02-11T14:15:00.000Z'
        }
    ];
    // Transactions
    const transactions = [
        // Scenario 5: Seller Share Exceeded Transaction
        {
            id: 'tx-demo-005',
            txReference: 'TX-DEMO-2026-005',
            parcelId: 'pcl-demo-1090',
            sellerId: 'usr-demo-001',
            buyerId: 'usr-demo-002',
            proposedArea: 4.0,
            proposedShare: 4.0,
            status: 'NEEDS_MANUAL_REVIEW',
            sellerConsent: true,
            buyerConsent: false,
            rejectionReason: 'Seller owned share (2.5 decimal) is less than proposed transfer (4.0 decimal).',
            transferNotes: 'Blocked due to share insufficiency rule.',
            evidenceDocIds: [],
            createdAt: '2026-02-11T14:10:00.000Z',
            updatedAt: '2026-02-11T14:15:00.000Z'
        },
        // Scenario 6: Awaiting Official Evidence
        {
            id: 'tx-demo-006',
            txReference: 'TX-DEMO-2026-006',
            parcelId: 'pcl-demo-1001',
            sellerId: 'usr-demo-001',
            buyerId: 'usr-demo-002',
            proposedArea: 2.0,
            proposedShare: 2.0,
            status: 'AWAITING_OFFICIAL_TRANSFER_EVIDENCE',
            sellerConsent: true,
            buyerConsent: true,
            transferNotes: 'Both parties consented. Awaiting certified registered deed and tax receipt upload.',
            evidenceDocIds: ['doc-demo-001'],
            createdAt: '2026-02-12T10:00:00.000Z',
            updatedAt: '2026-02-12T11:00:00.000Z'
        },
        // Scenario 7: Completed Simulated Transfer
        {
            id: 'tx-demo-007',
            txReference: 'TX-DEMO-2026-007',
            parcelId: 'pcl-demo-1001',
            sellerId: 'usr-demo-001',
            buyerId: 'usr-demo-002',
            proposedArea: 1.0,
            proposedShare: 1.0,
            status: 'COMPLETED',
            sellerConsent: true,
            buyerConsent: true,
            transferNotes: 'Simulated demonstration transfer completed. Ownership share transferred: 1.0 decimal from Tanvir to Farhana.',
            evidenceDocIds: ['doc-demo-001'],
            completedAt: '2026-02-01T15:00:00.000Z',
            createdAt: '2026-01-28T09:00:00.000Z',
            updatedAt: '2026-02-01T15:00:00.000Z'
        }
    ];
    // Admin Update Requests (Scenario 8: Awaiting User Consent via OTP)
    const adminUpdateRequests = [
        {
            id: 'req-demo-001',
            requestId: 'REQ-DEMO-2026-001',
            parcelId: 'pcl-demo-1042',
            targetUserId: 'usr-demo-001',
            adminAuthorId: 'usr-admin-001',
            fieldName: 'Survey Type (সার্ভে ধরণ)',
            oldValue: 'RS (রিভিশনাল সার্ভে)',
            proposedValue: 'BS (বাংলাদেশ সার্ভে)',
            reason: 'Official cadastral survey update recorded in District Gazeteer for Mouza Badda.',
            status: 'PENDING_USER_CONSENT',
            userOtpRequired: true,
            otpVerified: false,
            reviewedBy: 'Anisur Rahman',
            createdAt: '2026-02-14T10:00:00.000Z',
            updatedAt: '2026-02-14T10:00:00.000Z'
        }
    ];
    // Audit Events with Hash-chaining
    let prevHash = null;
    const auditEvents = [];
    const rawAuditEvents = [
        {
            actorId: 'usr-admin-001',
            actorRole: 'ADMIN',
            action: 'SYSTEM_INITIALIZATION',
            targetType: 'PLATFORM',
            targetId: 'SYS-LANDSURE-BD',
            reason: 'Platform seed initialization for Bangladesh land record verification demo.',
            outcome: 'SUCCESS',
            ipAddress: '127.0.0.1',
            timestamp: '2026-01-01T00:00:00.000Z'
        },
        {
            actorId: 'usr-demo-001',
            actorRole: 'CITIZEN',
            action: 'USER_REGISTERED',
            targetType: 'USER',
            targetId: 'usr-demo-001',
            reason: 'Citizen account created with mobile verification.',
            outcome: 'SUCCESS',
            ipAddress: '103.114.98.22',
            timestamp: '2026-01-15T08:00:00.000Z'
        },
        {
            actorId: 'usr-demo-001',
            actorRole: 'CITIZEN',
            action: 'PARCEL_REGISTERED',
            targetType: 'LAND_PARCEL',
            targetId: 'pcl-demo-1001',
            reason: 'Recorded Tejgaon Plot 342 under BS survey.',
            outcome: 'SUCCESS',
            ipAddress: '103.114.98.22',
            timestamp: '2026-01-16T10:00:00.000Z'
        },
        {
            actorId: 'usr-demo-001',
            actorRole: 'CITIZEN',
            action: 'DOCUMENT_UPLOADED',
            targetType: 'DOCUMENT',
            targetId: 'doc-demo-001',
            reason: 'Registered Deed uploaded; SHA-256 computed.',
            outcome: 'SUCCESS',
            ipAddress: '103.114.98.22',
            timestamp: '2026-01-16T10:15:00.000Z'
        },
        {
            actorId: 'SYS-FRAUD-ENGINE',
            actorRole: 'SYSTEM',
            action: 'FRAUD_ALERT_GENERATED',
            targetType: 'FRAUD_ALERT',
            targetId: 'alt-demo-001',
            reason: 'Duplicate plot transaction detected for Plot 1042.',
            outcome: 'BLOCKED',
            ipAddress: 'internal',
            timestamp: '2026-01-18T11:25:00.000Z'
        },
        {
            actorId: 'usr-admin-001',
            actorRole: 'ADMIN',
            action: 'UPDATE_REQUEST_CREATED',
            targetType: 'ADMIN_REQUEST',
            targetId: 'req-demo-001',
            reason: 'Proposed Survey Type change requiring citizen OTP consent.',
            outcome: 'SUCCESS',
            ipAddress: '103.114.98.1',
            timestamp: '2026-02-14T10:00:00.000Z'
        }
    ];
    for (const ev of rawAuditEvents) {
        const id = crypto.randomUUID();
        const payload = JSON.stringify({
            id,
            previousHash: prevHash,
            actorId: ev.actorId,
            actorRole: ev.actorRole,
            action: ev.action,
            targetType: ev.targetType,
            targetId: ev.targetId,
            reason: ev.reason,
            outcome: ev.outcome,
            ipAddress: ev.ipAddress,
            timestamp: ev.timestamp
        });
        const eventHash = crypto.createHash('sha256').update(payload).digest('hex');
        auditEvents.push({
            id,
            eventHash,
            previousHash: prevHash,
            actorId: ev.actorId,
            actorRole: ev.actorRole,
            action: ev.action,
            targetType: ev.targetType,
            targetId: ev.targetId,
            reason: ev.reason,
            outcome: ev.outcome,
            ipAddress: ev.ipAddress,
            timestamp: ev.timestamp
        });
        prevHash = eventHash;
    }
    return {
        users,
        parcels,
        ownershipClaims,
        documents,
        verificationReports,
        fraudAlerts,
        transactions,
        adminUpdateRequests,
        otpChallenges: [],
        auditEvents
    };
}
