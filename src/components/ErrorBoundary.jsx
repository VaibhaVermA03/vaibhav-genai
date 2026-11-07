import { Component } from 'react'

/** Keeps the page alive if a non-critical enhancement (e.g. WebGL) throws. */
export default class ErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(err) {
    if (import.meta.env.DEV) console.warn('[ErrorBoundary]', err)
  }
  render() {
    return this.state.failed ? this.props.fallback ?? null : this.props.children
  }
}
