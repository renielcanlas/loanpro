import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { motion } from 'framer-motion'
import {
  FaCreditCard,
  FaFile as FaFileAlt,
  FaChartLine,
  FaShield as FaShieldAlt,
  FaUserCheck,
  FaLaptop
} from 'react-icons/fa6'

function Home() {
  const { isAuthenticated } = useAuth()
  
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }
  
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div 
              className="text-center md:text-left"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Simplified Loan Management System
              </h1>
              <p className="text-lg mb-8 text-primary-50">
                Streamline your entire loan process from application to payment collection
                with our comprehensive LoanPro platform.
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                {isAuthenticated ? (
                  <Link 
                    to="/dashboard" 
                    className="btn bg-white text-primary-700 hover:bg-primary-50"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/register" 
                      className="btn bg-white text-primary-700 hover:bg-primary-50"
                    >
                      Get Started
                    </Link>
                    <Link 
                      to="/login" 
                      className="btn bg-primary-700 text-white hover:bg-primary-600 border border-primary-400"
                    >
                      Log In
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:block"
            >
              <img 
                src="https://images.pexels.com/photos/7882547/pexels-photo-7882547.jpeg" 
                alt="Loan Management" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </div>
        
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1440 320" 
            className="w-full h-auto"
          >
            <path 
              fill="#ffffff" 
              fillOpacity="1" 
              d="M0,224L60,229.3C120,235,240,245,360,234.7C480,224,600,192,720,192C840,192,960,224,1080,234.7C1200,245,1320,235,1380,229.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            {...fadeIn}
          >
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">
              Comprehensive Loan Management Features
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Our platform provides all the tools you need to efficiently manage your loan operations
              from initial application to final payment.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FaFileAlt className="h-6 w-6 text-primary-600" />,
                title: 'Streamlined Applications',
                description: 'Collect client information, perform initial reviews, and move applications through a structured workflow.'
              },
              {
                icon: <FaUserCheck className="h-6 w-6 text-primary-600" />,
                title: 'Credit Investigation',
                description: 'Conduct credit investigations with proper documentation and approval workflows.'
              },
              {
                icon: <FaCreditCard className="h-6 w-6 text-primary-600" />,
                title: 'Loan Disbursement',
                description: 'Process and track loan releases with proper documentation and approvals.'
              },
              {
                icon: <FaChartLine className="h-6 w-6 text-primary-600" />,
                title: 'Payment Tracking',
                description: 'Record and track all loan payments with automatic calculation of remaining balances.'
              },
              {
                icon: <FaLaptop className="h-6 w-6 text-primary-600" />,
                title: 'Client Portal',
                description: 'Allow clients to upload documents and view their loan details through a dedicated portal.'
              },
              {
                icon: <FaShieldAlt className="h-6 w-6 text-primary-600" />,
                title: 'Role-Based Access',
                description: 'Different interfaces and permissions for agents, investigators, finance officers, and clients.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="rounded-full bg-primary-50 p-3 inline-flex mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg"
                alt="About LoanPro"
                className="rounded-lg shadow-md"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-neutral-800 mb-4">
                Why Choose LoanPro?
              </h2>
              <p className="text-lg text-neutral-700 mb-6">
                LoanPro was designed by lending professionals who understand the 
                challenges of managing the loan process from start to finish.
              </p>
              
              <div className="space-y-4">
                {[
                  {
                    title: 'Increased Efficiency',
                    description: 'Reduce the time spent on administrative tasks by up to 70%'
                  },
                  {
                    title: 'Better Client Experience',
                    description: 'Provide a seamless experience for your clients with our intuitive interface'
                  },
                  {
                    title: 'Data-Driven Decisions',
                    description: 'Make informed lending decisions with comprehensive client information'
                  },
                  {
                    title: 'Improved Compliance',
                    description: 'Stay compliant with regulatory requirements with proper documentation'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-neutral-800">{item.title}</h3>
                      <p className="text-neutral-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section id="contact" className="py-16 bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Loan Operations?
            </h2>
            <p className="text-lg text-primary-100 mb-8">
              Join thousands of lending professionals who have streamlined their
              loan management process with LoanPro.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home