jmeter -n `
  -t .\jmeter\scenarios\tms-load.jmx `
  -Jport=PORT_NUMBER `
  -Jusers=10 `
  -Jramp=30 `
  -Jduration=300 `
  -l .\jmeter\results\direct-20.jtl `
  -e -o .\jmeter\results\direct-20-report

@REM  example
jmeter -n `
  -t .\jmeter\scenarios\tms-load.jmx `
  -Jport=8081 `
  -Jusers=10 `
  -Jramp=30 `
  -Jduration=300 `
  -l .\jmeter\results\direct-20.jtl `
  -e -o .\jmeter\results\direct-20-report