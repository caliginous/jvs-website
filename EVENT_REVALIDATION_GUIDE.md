# Event Revalidation Guide

This document explains how to keep event cards up-to-date when events change in the Tessera system.

## 🔄 **How It Works**

The main JVS website (`jvs-vercel.vercel.app`) now pulls event data from the Tessera API (`tickets.jvs.org.uk/api/public/events`). To ensure event cards stay current, we use a multi-layered revalidation strategy:

### **1. Automatic Revalidation (ISR)**
- **Main page** (`/`): Refreshes every 1 hour
- **Events page** (`/events`): Refreshes every 1 hour  
- **Individual event pages** (`/events/{id}`): Refresh every 1 hour

### **2. On-Demand Revalidation**
- **API endpoint**: `/api/revalidate-events`
- **Triggers**: Manual calls, webhooks, or automated scripts
- **Immediate**: Updates specific pages instantly

## 🚀 **Setting Up Revalidation**

### **Environment Variables**
Add this to your Vercel environment variables:

```bash
REVALIDATION_SECRET=your-secret-key-here
```

### **Testing Revalidation**
Test the revalidation endpoint:

```bash
# Revalidate all events
curl "https://jvs-vercel.vercel.app/api/revalidate-events?secret=YOUR_SECRET"

# Revalidate specific event
curl "https://jvs-vercel.vercel.app/api/revalidate-events?secret=YOUR_SECRET&eventId=1"
```

## 📋 **When to Revalidate**

### **Event Created**
```bash
curl -X POST "https://jvs-vercel.vercel.app/api/revalidate-events" \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "YOUR_SECRET",
    "action": "event_created",
    "eventId": 123
  }'
```

### **Event Updated**
```bash
curl -X POST "https://jvs-vercel.vercel.app/api/revalidate-events" \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "YOUR_SECRET",
    "action": "event_updated",
    "eventId": 123
  }'
```

### **Event Deleted**
```bash
curl -X POST "https://jvs-vercel.vercel.app/api/revalidate-events" \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "YOUR_SECRET",
    "action": "event_deleted",
    "eventId": 123
  }'
```

## 🔧 **Integration Options**

### **Option 1: Manual Revalidation**
Run revalidation commands manually when events change.

### **Option 2: Webhook Integration**
Set up webhooks in your Tessera admin system to call the revalidation endpoint automatically.

### **Option 3: Scheduled Revalidation**
Set up a cron job or scheduled task to revalidate periodically:

```bash
# Revalidate every 15 minutes
*/15 * * * * curl "https://jvs-vercel.vercel.app/api/revalidate-events?secret=YOUR_SECRET"
```

### **Option 4: Admin Panel Integration**
Add revalidation buttons to your Tessera admin panel for immediate updates.

## 📊 **Monitoring & Debugging**

### **Check Revalidation Status**
```bash
curl "https://jvs-vercel.vercel.app/api/revalidate-events?secret=YOUR_SECRET"
```

### **Vercel Dashboard**
- Check deployment logs for revalidation activity
- Monitor build cache usage
- View page generation times

### **Common Issues**
1. **Secret mismatch**: Ensure `REVALIDATION_SECRET` is set correctly
2. **Rate limiting**: Vercel has limits on revalidation frequency
3. **Cache conflicts**: Sometimes manual cache clearing is needed

## 🎯 **Best Practices**

### **Revalidation Frequency**
- **Low-traffic sites**: 1-2 hours is fine
- **High-traffic sites**: Consider 15-30 minutes
- **Critical updates**: Use on-demand revalidation

### **Security**
- Keep your revalidation secret secure
- Use HTTPS for all revalidation calls
- Consider IP whitelisting for production

### **Performance**
- Don't revalidate unnecessarily
- Batch multiple event updates when possible
- Monitor Vercel build minutes usage

## 🔗 **Related Files**

- `src/app/page.tsx` - Main page with hourly revalidation
- `src/app/events/page.tsx` - Events page with hourly revalidation
- `src/app/events/[slug]/page.tsx` - Individual event pages with hourly revalidation
- `src/app/api/revalidate-events/route.ts` - Revalidation API endpoint
- `src/lib/tessera-api.ts` - Tessera API integration

## 📞 **Support**

For issues with event revalidation:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test revalidation endpoint manually
4. Check Tessera API status
