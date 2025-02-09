FROM oven/bun:1.2.2

# Set the working directory
WORKDIR /benchmarks/bun-1

# Copy package files and install dependencies
COPY package.json bun.lock ./
RUN bun install

# Copy the rest of the project files
COPY . .

# Start the application
CMD ["bun", "index.ts"]
