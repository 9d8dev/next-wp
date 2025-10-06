# Session: Custom Domain Setup and Environment Configuration

**Session ID**: SES-2024-002  
**Date**: October 6, 2025  
**Duration**: 1 hour  
**Participants**: Project Lead, Development Team

## Session Objectives
Configure custom domains for all DapFlow environments and resolve Vercel preview protection issues to enable seamless team access across all deployment environments.

## Agenda
1. Troubleshoot develop branch preview URL authentication issues
2. Configure custom domain for development environment
3. Update documentation with new URLs
4. Test all environment access

## Discussion Points

### Issue Discovery: Preview Protection
**Problem**: The develop branch preview URL (`dap-flow-git-develop-toffyjars-projects.vercel.app`) was requiring authentication despite environment variables being properly configured.

**Investigation**:
- Initial assumption: Missing environment variables
- Verified WordPress REST API was accessible (HTTP 200)
- Tested preview URL showed HTTP 401 Unauthorized
- Discovered Vercel preview protection was enabled

**Root Cause**: Vercel's preview protection feature was blocking unauthenticated access to preview URLs, not a WordPress or environment configuration issue.

### Solution Implementation
**Approach 1**: Disable preview protection in Vercel project settings
- Navigated to Vercel Dashboard → Project Settings → General
- Disabled preview protection for staging and develop branches
- Result: Successfully resolved authentication requirement

**Approach 2**: Configure custom domain for develop branch
- Added `dev.dapflow.com` as custom domain in Vercel
- Assigned domain to `develop` branch (Preview environment)
- Configured DNS CNAME record pointing to `cname.vercel-dns.com`
- Verified DNS propagation and SSL certificate generation

### Custom Domain Strategy
Decided to implement consistent custom domain strategy:
- **Production**: `dapflow.com` (already configured)
- **Staging**: `stage.dapflow.com` (already configured)
- **Development**: `dev.dapflow.com` (newly configured)

### Benefits Realized
1. **Professional URLs**: Easy to remember and share
2. **No Authentication Barriers**: Team can access without login
3. **Consistent Branding**: All environments use dapflow.com domain
4. **Better Developer Experience**: Simplified workflow

## Decisions Made
- Disable preview protection for staging and development environments
- Implement custom domain `dev.dapflow.com` for develop branch
- Keep auto-generated URLs for individual feature branches
- Update all documentation with new environment URLs

## Action Items
- [x] Disable preview protection in Vercel - Project Lead - Completed
- [x] Configure `dev.dapflow.com` custom domain - Project Lead - Completed
- [x] Add DNS CNAME record for dev subdomain - Project Lead - Completed
- [x] Verify DNS propagation and SSL certificates - Project Lead - Completed
- [x] Update `.context/current_state.md` with new URLs - Project Lead - Completed
- [x] Update `.context/quick_reference.md` - Project Lead - Completed
- [x] Create decision record (ADR-2024-003) - Project Lead - Completed
- [ ] Communicate new URLs to team members - Project Lead - Next
- [ ] Update any external documentation or links - Documentation Team - Next week

## Key Insights

### Vercel Preview Protection
- Preview protection is enabled by default for new Vercel projects
- Can cause confusion when environment variables are correctly configured
- Custom domains bypass preview protection automatically
- Consider disabling for internal team environments

### DNS Configuration
- CNAME records propagate quickly (10-15 minutes typical)
- Vercel automatically generates SSL certificates for custom domains
- Consistent subdomain naming improves team communication

### Environment Strategy
- Custom domains significantly improve developer experience
- Having consistent naming across environments reduces confusion
- Auto-generated URLs still useful for temporary feature testing

## Technical Details

### DNS Records Added
```
Type: CNAME
Name: dev
Value: cname.vercel-dns.com
TTL: 3600
```

### Vercel Configuration
- Domain: `dev.dapflow.com`
- Environment: Preview
- Branch: develop
- SSL: Automatically provisioned
- Preview Protection: Disabled

### Environment Variables Verified
```bash
WORDPRESS_URL=https://cms.dapflow.com
WORDPRESS_HOSTNAME=cms.dapflow.com
WORDPRESS_WEBHOOK_SECRET=configured
```

## Follow-up Required
- Monitor DNS resolution for any issues
- Track team adoption of new development URL
- Consider adding more custom subdomains if needed (api, docs, admin)
- Document troubleshooting steps for future reference

## Related
- **Tasks**: Domain configuration and environment setup tasks
- **Decisions**: ADR-2024-003 (Custom domain strategy)
- **PRs**: Branch deployment configuration updates

## Notes

### Troubleshooting Process
The session demonstrated effective troubleshooting methodology:
1. Verify the actual error (HTTP 401 vs configuration issue)
2. Test individual components (WordPress API, environment variables)
3. Identify the real problem (Vercel preview protection)
4. Implement immediate fix (disable protection)
5. Implement long-term solution (custom domains)

### Team Communication
Clear communication about environment URLs is critical:
- Old URL: `dap-flow-git-develop-toffyjars-projects.vercel.app`
- New URL: `dev.dapflow.com`
- Much easier to communicate and remember

### Best Practices Established
- Use custom domains for frequently accessed environments
- Disable preview protection for internal team environments
- Maintain consistent subdomain naming conventions
- Document DNS configuration for future reference

The session successfully resolved authentication issues and established a professional, scalable domain strategy for all DapFlow environments.
