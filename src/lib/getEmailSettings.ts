// Simplified version for main website - no database dependency

export interface EmailSettings {
  supportEmail: string;
  appName: string;
  appUrl: string;
  senderName: string;
  infoEmail: string;
  legalEmail: string;
  privacyEmail: string;
}

/**
 * Get email settings for the main website (static values)
 * This function returns static configuration without database dependency
 */
export async function getEmailSettings(): Promise<EmailSettings> {
  // Return static values for main website
  return {
    supportEmail: 'support@jvs.org.uk',
    appName: 'JVS',
    appUrl: 'https://jvs.org.uk',
    senderName: 'JVS',
    infoEmail: 'info@jvs.org.uk',
    legalEmail: 'legal@jvs.org.uk',
    privacyEmail: 'privacy@jvs.org.uk'
  };
}

/**
 * Get a specific email setting by key
 */
export async function getEmailSetting(key: keyof EmailSettings): Promise<string> {
  const settings = await getEmailSettings();
  return settings[key];
}

/**
 * Get email settings for static generation
 * This version is specifically for use in getStaticProps
 */
export async function getStaticEmailSettings(): Promise<EmailSettings> {
  return await getEmailSettings();
}
