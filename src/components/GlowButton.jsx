export default function GlowButton({as:Comp='button', className='', children, ...props}){
  return (
    <Comp className={`btn btn-gradient pulse ${className}`} {...props}>
      {children}
    </Comp>
  )
}
