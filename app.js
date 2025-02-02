$(document).ready(function () {
    const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQemQjTYwk8ennm8gMjbHvhvXiizWmG6wFDDZLVg0N4WWOYA_89IezaYmArtSELCpQ08oIijABOZRiQ/pub?output=csv';

    $.get(CSV_URL, function (data) {
        const lines = data.split('\n');
        const blockColors = {};
        const blockDetails = {}; // Object to store details for each block
        const classTotals = {};

        // Parse the CSV data
        for (let i = 1; i < lines.length; i++) {
            const currentLine = lines[i].split(',');
            if (currentLine.length >= 3) {
                const blockNumber = parseInt(currentLine[0], 10);
                const colorClass = currentLine[1].trim();
                const detail = currentLine[2].trim();

                if (!isNaN(blockNumber) && colorClass) {
                    blockColors[blockNumber] = colorClass;
                    blockDetails[blockNumber] = detail;

                    if (classTotals[colorClass]) {
                        classTotals[colorClass]++;
                    } else {
                        classTotals[colorClass] = 1;
                    }
                }
            }
        }

        // Display totals with matching colors
        const totalsContainer = $('#totals-container');
        totalsContainer.html('');
        for (const [colorClass, count] of Object.entries(classTotals)) {
            const totalDisplay = $('<div class="total-display">' + colorClass + ': ' + '(' + count + ')' + '</div>');
            totalDisplay.addClass(colorClass); // Add class to match styles
            totalsContainer.append(totalDisplay);
        }

        // Adjust to create 60 blocks in total
        const totalBlocks = 60;
        const blocksPerContainer = 10;
        const totalContainers = totalBlocks / blocksPerContainer;

        // Create containers
        for (let containerIndex = totalContainers - 1; containerIndex >= 0; containerIndex--) {
            const waffleWrapper = $('<div class="waffle-wrapper"></div>');
            const waffle = $('<div class="waffle"></div>');

            for (let blockIndex = 0; blockIndex < blocksPerContainer; blockIndex++) {
                const blockNumber = (totalContainers - 1 - containerIndex) * blocksPerContainer + blockIndex + 1;
                const block = $('<div class="block"></div>');

                // Apply the color class from the CSV
                if (blockColors[blockNumber]) {
                    block.addClass(blockColors[blockNumber]);
                }

                // Click event to show modal with details
                block.click(function () {
                    $('#details-text').text(blockDetails[blockNumber] || 'No details available.');
                    $('#myModal').css('display', 'block');
                });

                waffle.append(block);
            }

            waffleWrapper.append(waffle);
            $('#waffle-container').append(waffleWrapper);
        }

        // Modal close
        $('.close').click(function () {
            $('#myModal').css('display', 'none');
        });

        // Close modal when clicking anywhere outside
        $(window).click(function (event) {
            if ($(event.target).is('#myModal')) {
                $('#myModal').css('display', 'none');
            }
        });

    }).fail(function () {
        console.error('Error fetching CSV data');
    });
});
