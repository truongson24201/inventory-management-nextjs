LoadingProvider is used to provide loading animation

### How to use
1. Wrap <LoadingProvider> outside of <App> component.
2. Create an init of `useLoadingAnimation` Hook.
3. The Hook returns 2 methods: `show` & `hide`

### How does it work?
1. <LoadingProvider> component uses `isShow` state to toggle Spinner animation.
2. <LoadingProvider> passes `setIsShow` setting method to provider.
3. `useLoadingAnimation` uses `setIsShow` passed through Context to toggle animation.
