/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['picsum.photos','i.scdn.co', 'pub-c6a134c8e1fd4881a475bf80bc0717ba.r2.dev'],
    },
    experimental: {
        turbo: {
            
        },
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.lottie$/,
            type: 'asset/resource',
            generator: {
                filename: 'static/media/[name].[hash][ext]'
            }
        });
        
        return config;
    },
};

export default nextConfig;
