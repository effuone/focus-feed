'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FocusIcon } from 'lucide-react';

export default function Home() {
  useEffect(() => {
    const smoothScroll = (e: any) => {
      e.preventDefault();
      const href = e.currentTarget.getAttribute('href');
      document.querySelector(href).scrollIntoView({
        behavior: 'smooth',
      });
    };

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', smoothScroll);
    });

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.removeEventListener('click', smoothScroll);
      });
    };
  }, []);

  return (
    <div className='flex flex-col min-h-[100dvh]'>
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='px-4 lg:px-6 h-14 flex items-center fixed w-full bg-background/80 backdrop-blur-sm z-50'
      >
        <Link
          href='#'
          className='flex items-center justify-center'
          prefetch={false}
        >
          <FocusIcon className='h-6 w-6' />
          <span className='sr-only'>FocusFeed</span>
        </Link>
        <nav className='ml-auto flex gap-4 sm:gap-6'>
          <Link
            href='#features'
            className='text-sm font-medium hover:underline underline-offset-4'
            prefetch={false}
          >
            Features
          </Link>
          <Link
            href='#demo'
            className='text-sm font-medium hover:underline underline-offset-4'
            prefetch={false}
          >
            Product Demo
          </Link>
          <Link
            href='#vision'
            className='text-sm font-medium hover:underline underline-offset-4'
            prefetch={false}
          >
            Our Vision
          </Link>
        </nav>
      </motion.header>

      <main className='flex-1 pt-14'>
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className='w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden'
        >
          <div className='container px-4 md:px-6 relative z-10'>
            <div className='grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]'>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className='flex flex-col justify-center space-y-4'
              >
                <div className='space-y-2'>
                  <h1 className='text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none'>
                    Unlock the Power of Focused Learning
                  </h1>
                  <p className='max-w-[600px] text-muted-foreground md:text-xl'>
                    FocusFeed transforms educational content into short,
                    engaging video summaries, empowering you to learn
                    efficiently and combat attention deficit.
                  </p>
                </div>
                <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                  <Link
                    href='/auth'
                    className='inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
                    prefetch={false}
                  >
                    Get Started
                  </Link>
                  <Link
                    href='#features'
                    className='inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
                    prefetch={false}
                  >
                    Learn More
                  </Link>
                </div>
              </motion.div>
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                src='assets/feature.png'
                alt='Hero'
                className='mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last'
                width='550'
                height='550'
              />
            </div>
          </div>
          <div className='absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 opacity-30' />
        </motion.section>
        <section
          id='features'
          className='w-full py-12 md:py-24 lg:py-32 bg-muted'
        >
          <div className='container px-4 md:px-6'>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className='flex flex-col items-center justify-center space-y-4 text-center'
            >
              <div className='inline-block rounded-lg bg-muted px-3 py-1 text-sm'>
                Key Features
              </div>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
                Transforming Learning with AI
              </h2>
              <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                FocusFeed uses advanced AI to create personalized video
                summaries that keep you engaged and focused, making learning
                more efficient and enjoyable.
              </p>
            </motion.div>
            <div className='mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12'>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className='flex flex-col justify-center space-y-4'
              >
                <ul className='grid gap-6'>
                  <li>
                    <div className='grid gap-1'>
                      <h3 className='text-xl font-bold'>
                        Personalized Learning Experience
                      </h3>
                      <p className='text-muted-foreground'>
                        Customize your feed based on your interests, preferred
                        content length, and learning goals. FocusFeed learns
                        from your interactions to provide increasingly
                        personalized content over time.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className='grid gap-1'>
                      <h3 className='text-xl font-bold'>
                        Multi-Format Support
                      </h3>
                      <p className='text-muted-foreground'>
                        Upload text, audio, or video content, and FocusFeed will
                        create concise, easy-to-understand video summaries for
                        each.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className='grid gap-1'>
                      <h3 className='text-xl font-bold'>
                        TikTok-Style Presentation
                      </h3>
                      <p className='text-muted-foreground'>
                        Summaries are presented in a short, engaging video
                        format, similar to TikTok, which keeps users focused and
                        reduces cognitive overload.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className='grid gap-1'>
                      <h3 className='text-xl font-bold'>
                        Diverse Content Sources
                      </h3>
                      <p className='text-muted-foreground'>
                        Whether it’s a book, article, podcast, or video,
                        FocusFeed can integrate content from multiple sources
                        and formats, delivering a cohesive learning experience.
                      </p>
                    </div>
                  </li>
                </ul>
              </motion.div>
              <motion.img
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                src='assets/philosophy.png'
                alt='Features'
                className='mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last'
                width='600'
                height='510'
              />
            </div>
          </div>
        </section>
        <section
          id='demo'
          className='w-full py-12 md:py-24 lg:py-32'
        >
          <div className='container px-4 md:px-6'>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className='flex flex-col items-center justify-center space-y-4 text-center'
            >
              {' '}
              <div className='inline-block rounded-lg bg-muted px-3 py-1 text-sm'>
                {' '}
                Product Demo{' '}
              </div>{' '}
              <h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
                {' '}
                See FocusFeed in Action{' '}
              </h2>{' '}
              <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                {' '}
                Discover how FocusFeed transforms your learning experience.
                Watch our demo videos to see the power of personalized,
                multi-format content in action.{' '}
              </p>{' '}
              <div className='flex justify-center'>
                {' '}
                <Link
                  href='https://www.loom.com/share/082a208e36044e8db6bddd3e253f3878'
                  className='inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
                  prefetch={false}
                >
                  {' '}
                  Watch Demo{' '}
                </Link>{' '}
              </div>{' '}
            </motion.div>{' '}
          </div>{' '}
        </section>
        <section
          id='vision'
          className='w-full py-12 md:py-24 lg:py-32 bg-muted'
        >
          <div className='container px-4 md:px-6'>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className='flex flex-col items-center justify-center space-y-4 text-center'
            >
              <div className='inline-block rounded-lg bg-muted px-3 py-1 text-sm'>
                Our Vision
              </div>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
                Shaping the Future of Learning
              </h2>
              <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                At FocusFeed, our vision is to make learning more accessible and
                engaging by leveraging AI to deliver personalized, concise
                content that fits seamlessly into your life. We aim to
                revolutionize how you consume educational material and stay
                informed.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className='bg-background py-6 text-center text-sm'>
        <p>&copy; {new Date().getFullYear()} FocusFeed. All rights reserved.</p>
      </footer>
    </div>
  );
}
