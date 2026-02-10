/**
 * Consistent dummy data for filling missing customer/order information
 * This ensures data matches across Dashboard, Orders, and Customers pages
 */

export const FALLBACK_CUSTOMER_NAMES = [
    'Fatima Khan',
    'Ahmed Ali',
    'Sara Malik',
    'Hassan Ali',
    'Bilal Hassan',
    'Aisha Noor',
    'Ali Hassan',
    'Zainab Iqbal',
    'Usman Shah',
    'Ayesha Siddiqui',
    'Imran Malik',
    'Mariam Butt',
    'Kamran Ali',
    'Hira Khan',
    'Asad Mahmood',
    'Sana Riaz',
    'Faisal Sheikh',
    'Nida Saeed',
    'Rizwan Dar',
    'Hina Tariq'
]

export const FALLBACK_EMAILS = [
    'fatima.k@gmail.com',
    'ahmed.ali@yahoo.com',
    'sara.malik@hotmail.com',
    'hassan.a@gmail.com',
    'bilal.h@gmail.com',
    'aisha.noor@yahoo.com',
    'ali.hassan@gmail.com',
    'zainab.i@gmail.com',
    'usman.shah@hotmail.com',
    'ayesha.s@gmail.com'
]

export const FALLBACK_PHONES = [
    '+92 300 1234567',
    '+92 301 9876543',
    '+92 333 4567890',
    '+92 345 2345678',
    '+92 320 8765432',
    '+92 321 1112233',
    '+92 311 5556677',
    '+92 342 9998877',
    '+92 335 4445566',
    '+92 300 7778899'
]

/**
 * Get consistent customer name based on ID
 */
export function getCustomerName(customerId: number | string, existingName?: string | null): string {
    if (existingName) return existingName

    const id = typeof customerId === 'string' ? parseInt(customerId) : customerId
    const index = id % FALLBACK_CUSTOMER_NAMES.length
    return FALLBACK_CUSTOMER_NAMES[index]
}

/**
 * Get consistent email based on ID
 */
export function getCustomerEmail(customerId: number | string, existingEmail?: string | null): string {
    if (existingEmail) return existingEmail

    const id = typeof customerId === 'string' ? parseInt(customerId) : customerId
    const index = id % FALLBACK_EMAILS.length
    return FALLBACK_EMAILS[index]
}

/**
 * Get consistent phone based on ID
 */
export function getCustomerPhone(customerId: number | string, existingPhone?: string | null): string {
    if (existingPhone) return existingPhone

    const id = typeof customerId === 'string' ? parseInt(customerId) : customerId
    const index = id % FALLBACK_PHONES.length
    return FALLBACK_PHONES[index]
}

/**
 * Split a full name into first and last name
 */
export function splitName(fullName: string): { firstName: string, lastName: string } {
    const parts = fullName.split(' ')
    return {
        firstName: parts[0] || 'Customer',
        lastName: parts.slice(1).join(' ') || 'User'
    }
}
