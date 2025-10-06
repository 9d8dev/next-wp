# Gotchas - Known Issues and Solutions

## WordPress Integration Issues

### Issue: WORDPRESS_URL Environment Variable Missing
**Problem**: Build fails with "WORDPRESS_URL environment variable is not defined"
**Solution**: 
- Add `WORDPRESS_URL` to Vercel environment variables
- Ensure it's set for Production, Preview, and Development environments
- Use same value across all environments: `https://cms.dapflow.com`

### Issue: WordPress Plugin Not Triggering Revalidation
**Problem**: Changes in WordPress don't reflect on Next.js site
**Solutions**:
1. Verify plugin is installed and activated
2. Check webhook secret matches in both WordPress and Vercel
3. Ensure Next.js URL is correct in plugin settings
4. Test webhook endpoint manually: `POST https://dapflow.com/api/revalidate`

### Issue: Featured Images Not Loading
**Problem**: Post featured images return 404 or don't display
**Solutions**:
1. Verify `WORDPRESS_HOSTNAME` is set correctly
2. Check WordPress media URL structure
3. Ensure images are properly uploaded to WordPress
4. Verify Next.js Image component configuration

### Issue: WordPress API Rate Limiting
**Problem**: API calls fail with rate limit errors
**Solutions**:
1. Implement request caching (already in place)
2. Reduce `revalidate` time for less frequent updates
3. Consider WordPress caching plugins
4. Monitor API usage and optimize queries

## Next.js Build and Deployment Issues

### Issue: Build Fails on Vercel
**Problem**: Deployment fails during build process
**Common Causes & Solutions**:
1. **Missing environment variables**: Add all required vars in Vercel
2. **TypeScript errors**: Fix type issues locally first
3. **Memory limits**: Optimize build process, reduce bundle size
4. **Dependency conflicts**: Check `pnpm-lock.yaml` for conflicts

### Issue: Staging Domain Not Deploying
**Problem**: `stage.dapflow.com` shows old content or doesn't work
**Solutions**:
1. Trigger deployment by pushing to `staging` branch
2. Check Vercel deployment logs
3. Verify DNS records are correct
4. Ensure environment variables are set for Preview environment

### Issue: Preview URLs Not Working
**Problem**: Feature branch previews fail to deploy
**Solutions**:
1. Check branch protection rules
2. Verify environment variables for Preview environment
3. Look for build errors in Vercel dashboard
4. Ensure feature branch is pushed to remote

## Performance Issues

### Issue: Slow Page Load Times
**Problem**: Pages take too long to load
**Solutions**:
1. **Use server-side pagination**: Replace `getAllPosts` with `getPostsPaginated`
2. **Optimize images**: Use Next.js Image component
3. **Enable caching**: Check cache headers and ISR configuration
4. **Reduce bundle size**: Analyze with `pnpm build --analyze`

### Issue: Search Performance Degradation
**Problem**: Search becomes slow with many posts
**Solutions**:
1. Implement search debouncing (already in place)
2. Add search result caching
3. Consider WordPress search optimization
4. Limit search results per page

### Issue: Cache Not Invalidating
**Problem**: Changes don't appear despite cache invalidation
**Solutions**:
1. Check cache tag hierarchy
2. Verify webhook payload structure
3. Test manual revalidation: `revalidateTag("wordpress")`
4. Check Vercel cache settings

## Development Environment Issues

### Issue: Local Development Not Connecting to WordPress
**Problem**: `pnpm dev` shows errors or no content
**Solutions**:
1. Create `.env.local` file with WordPress credentials
2. Check WordPress REST API is enabled
3. Verify network connectivity to `https://cms.dapflow.com`
4. Check for CORS issues in WordPress

### Issue: Hot Reload Not Working
**Problem**: Changes don't reflect during development
**Solutions**:
1. Restart development server
2. Clear Next.js cache: `rm -rf .next`
3. Check file watchers are working
4. Verify no syntax errors in code

### Issue: TypeScript Errors in Development
**Problem**: Type errors prevent development
**Solutions**:
1. Update WordPress types if API changes
2. Check for missing type definitions
3. Use `any` type temporarily for quick fixes
4. Update dependencies if needed

## Git and Branch Issues

### Issue: Merge Conflicts on Staging
**Problem**: Conflicts when merging to staging branch
**Solutions**:
1. Always merge from `develop` to `staging`
2. Keep branches up to date
3. Resolve conflicts locally before pushing
4. Use `git pull --rebase` for cleaner history

### Issue: Feature Branch Behind Main
**Problem**: Feature branch is outdated
**Solutions**:
1. Rebase feature branch on latest `develop`
2. Resolve conflicts during rebase
3. Force push if necessary: `git push --force-with-lease`
4. Update PR after rebase

### Issue: Wrong Branch Deployed
**Problem**: Wrong code is live on production
**Solutions**:
1. Check Vercel deployment logs
2. Verify branch configuration in Vercel
3. Redeploy correct branch
4. Implement branch protection rules

## Content and SEO Issues

### Issue: OG Images Not Generating
**Problem**: Social sharing shows default images
**Solutions**:
1. Test OG endpoint: `/api/og?title=Test&description=Test`
2. Check Edge Runtime configuration
3. Verify image generation dependencies
4. Test with different browsers

### Issue: Sitemap Not Updating
**Problem**: Sitemap doesn't include new content
**Solutions**:
1. Check sitemap generation: `/sitemap.xml`
2. Verify WordPress content is published
3. Check for build errors in sitemap generation
4. Manually trigger sitemap rebuild

### Issue: Search Engines Not Indexing
**Problem**: Content not appearing in search results
**Solutions**:
1. Submit sitemap to Google Search Console
2. Check robots.txt configuration
3. Verify meta tags are generated correctly
4. Test with Google's Rich Results Test

## Team Collaboration Issues

### Issue: Environment Variables Not Synced
**Problem**: Team members have different configurations
**Solutions**:
1. Document all required environment variables
2. Create `.env.example` file (already exists)
3. Use consistent values across environments
4. Document setup process for new team members

### Issue: Code Review Conflicts
**Problem**: Disagreements in code review process
**Solutions**:
1. Establish clear coding standards
2. Use automated linting and formatting
3. Document review criteria
4. Create escalation process for conflicts

### Issue: Deployment Coordination
**Problem**: Multiple people deploying simultaneously
**Solutions**:
1. Implement deployment schedule
2. Use branch protection rules
3. Communicate deployments in team chat
4. Monitor deployment status

## Prevention Strategies

### Code Quality
- Use TypeScript strict mode
- Implement automated testing
- Use ESLint and Prettier
- Regular dependency updates

### Monitoring
- Set up error tracking
- Monitor performance metrics
- Track API response times
- Monitor cache hit rates

### Documentation
- Keep README updated
- Document API changes
- Record architectural decisions
- Maintain troubleshooting guides

### Team Processes
- Regular code reviews
- Pair programming for complex features
- Knowledge sharing sessions
- Incident post-mortems
